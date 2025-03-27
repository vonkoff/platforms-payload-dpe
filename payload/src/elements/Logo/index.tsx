import Image from "next/image";

export const Logo = () => {
  return (
    <span style={{ position: "relative", width: "256px", height: "256px" }}>
      <Image src="/logo.svg" alt="" fill />
    </span>
  );
};

export const Icon = () => {
  return (
    <span style={{ position: "relative", width: "60px", height: "60px" }}>
      <Image src="/navIcon.svg" alt="" fill style={{ objectFit: "contain" }} />
    </span>
  );
};
