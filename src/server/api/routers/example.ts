import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getAllWeightEntries: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.weightEntry.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  addWeightEntry: protectedProcedure
    .input(
      z.object({
        kg: z.number().positive(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.weightEntry.create({
        data: {
          userId: ctx.session.user.id,
          kg: input.kg,
        },
      });
    }),

  deleteWeightEntry: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.weightEntry.delete({ where: { id: input.id } });
    }),

  updateWeightEntry: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        kg: z.number(),
        created_at: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // ctx.session.user.id
      if ( (await ctx.prisma.weightEntry.findFirst({where: {id: input.id}}))?.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "The current session is not authorized to update this entry",
        })
      }
      await ctx.prisma.weightEntry.update({
        where: { id: input.id },
        data: { kg: input.kg, created_at: input.created_at },
      });
    }),
});
