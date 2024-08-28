import { router } from "../../server.js";
import { mutations } from "./mutations.js";
import { queries } from "./queries.js";

export const user = router({
    ...queries,
    ...mutations,
});
