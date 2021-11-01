/// <reference types="node" />

/**
 * @returns A promise of the absolute path to the Hugo executable (`hugo.exe` on
 * Windows, simply `hugo` otherwise) once it's installed.
 */
export default function hugo(): Promise<string>;
