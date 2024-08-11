import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://localhost:3000/api/graphql",
    generates: {
        "src/generated/server.ts": {
            plugins: ["typescript", "typescript-resolvers"],
        },
        "src/generated/client/": {
            preset: "client",
            plugins: [],
            presetConfig: {
                gqlTagName: "gql",
            },
        },
    },
    config: {
        contextType: "../graphql#Context",
    },
    ignoreNoDocuments: true,
};

export default config;
