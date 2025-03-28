export interface NavItemInterface {
    url: string;
    label: string;
    isActive?: boolean;
    onClick?: () => void;
}