/// <reference types="vite/client" />

declare module "*.csv" {
    const value: { [key: string]: string | number }[]; // Define the type of the imported CSV data as an array of objects
    export default value;
}
