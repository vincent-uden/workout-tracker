import { z } from "zod";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { sql } from "~/server/db";
import { env } from "~/env";
import { TRPCError } from "@trpc/server";

export const JwtSchema = z.object({
  userId: z.string(),
  userRole: z.string(),
});

function validateJwt(token: string) {
  if (token === "") {
    return null;
  }
  const decoded: any = jwt.verify(token, env.JWT_SECRET);
  if (!decoded) {
    return null;
  } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
    return null;
  } else {
    return JwtSchema.parse({
      userId: decoded.userId,
      userRole: decoded.userRole,
    });
  }
}

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3, "Username needs to be at least 3 characters long"),
        email: z.string().email(),
        password: z
          .string()
          .min(10, "Password needs to be at least 10 characters long"),
      }),
    )
    .mutation(async ({ input }) => {
      const newUser =
        await sql`INSERT INTO workout_users (username, email, password) VALUES (${
          input.username
        }, ${input.email}, ${await argon2.hash(input.password)})`;
      return newUser;
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const schema = z
        .array(
          z.object({
            id: z.string().uuid(),
            created_at: z.date(),
            username: z.string(),
            email: z.string(),
            password: z.string(),
            role: z.string(),
          }),
        )
        .nonempty();
      const matchingUser = schema.safeParse(
        await sql`SELECT * FROM workout_users WHERE username = ${input.username}`,
      );
      if (matchingUser.success) {
        const user = matchingUser.data[0];
        if (await argon2.verify(user.password, input.password)) {
          const token = jwt.sign(
            { userId: user.id, userRole: user.role },
            env.JWT_SECRET,
            { expiresIn: "90d" },
          );
          return token;
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Username or password not found",
      });
    }),
  validate: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      if (input.token === "") {
        return null;
      }
      const decoded: any = jwt.verify(input.token, env.JWT_SECRET);
      if (!decoded) {
        return null;
      } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
        return null;
      } else {
        return JwtSchema.parse({
          userId: decoded.userId,
          userRole: decoded.userRole,
        });
      }
    }),
  logWeight: publicProcedure
    .input(
      z.object({
        token: z.string(),
        weight: z.number().positive(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = validateJwt(input.token);
      if (user != null) {
        await sql`INSERT INTO workout_weight_entry (weight, user_id) VALUES (${
          input.weight
        }, ${user!!.userId})`;
      }
    }),
  deleteWeight: publicProcedure
    .input(
      z.object({
        token: z.string(),
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = validateJwt(input.token);
      if (user != null) {
        await sql`DELETE FROM workout_weight_entry WHERE user_id = ${user!!.userId} AND id = ${input.id}`;
      }
    }),
  getWeights: publicProcedure
    .input(
      z.object({
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const user = validateJwt(input.token);
      if (user != null) {
        const schema = z.array(
          z.object({
            id: z.string().uuid(),
            created_at: z.date(),
            weight: z.number(),
            user_id: z.string().uuid(),
          }),
        );
        return schema.parse(await sql`SELECT * FROM workout_weight_entry WHERE user_id = ${user.userId};`);
      }
    }),
});
