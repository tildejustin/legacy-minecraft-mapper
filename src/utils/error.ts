export default function error(str: string): never {
    throw new Error(str);
}
