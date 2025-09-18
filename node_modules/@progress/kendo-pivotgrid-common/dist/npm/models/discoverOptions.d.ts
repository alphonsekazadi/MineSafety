import { Connection } from "./connection";
import { Restrictions } from "./restrictions";
/**
 * @hidden
 */
export interface DiscoverOptions {
    connection: Connection;
    restrictions: Restrictions;
    command: string;
}
