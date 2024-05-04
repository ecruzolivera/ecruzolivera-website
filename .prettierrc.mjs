// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
    printWidth: 120,
    tabWidth: 2,
    trailingComma: "es5",
    semi: false,
    plugins: ["prettier-plugin-astro"],
    overrides: [
        {
            files: "*.astro",
            options: {
                parser: "astro",
            },
        },
    ],
}
