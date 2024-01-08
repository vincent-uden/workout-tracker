type BackgroundProps = {
  size?: number;
};

export async function Background(input: BackgroundProps) {
  const size = input.size ?? 100;

  return (
    <div
      id="bgPattern"
      className={`fixed left-0 top-0 h-screen w-screen overflow-clip opacity-25`}
      style={{
        backgroundSize: size,
        backgroundPositionX: "25%",
        maskImage: "linear-gradient(0deg, #fff0 0%, #fff0 80%, #ffff 100%)",
      }}
    />
  );
}
