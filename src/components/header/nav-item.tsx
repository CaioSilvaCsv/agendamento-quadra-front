import { NavItemInterface } from "@/hooks/use-navItems";
import Link from "next/link";

export default function NavItem(props : NavItemInterface){
    return(
        <Link href={props.url}
        className={`border-b-2 hover:border-solid hover:border-blue-300 
        transition-colors duration-500 ${props.isActive ? 'border-b-2 border-solid border-b-blue-500' : ''}`}
        onClick={props.onClick}
        >
            {props.label}
        </Link>
    )
}