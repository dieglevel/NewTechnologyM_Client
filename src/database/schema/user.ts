import { Realm } from "@realm/react";

export class UserSchema extends Realm.Object {
    static schema = {
        name: "User",
        properties: {
            _id: "objectId",
            name: "string",
            age: "int",
        },
        primaryKey: "_id",
    };
}