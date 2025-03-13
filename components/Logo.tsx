import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex justify-center mt-4">
      <Image
        src="/logoipsum-291.svg"
        alt="Logo"
        width={72} // Adjust width as needed
        height={40} // Adjust height as needed
      />
    </div>
  );
}