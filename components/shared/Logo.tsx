import Image from "next/image";

export default function Logo(){

    return (
        <Image
            src = "/Logo.png"
            width = {1024}
            height = {1024}
            alt = "Logo"
            className = "w-20 h-20"
            priority
        />
    )

}