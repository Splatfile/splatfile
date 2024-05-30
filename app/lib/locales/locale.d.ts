// To parse this data:
//
//   import { Convert, Locale } from "./file";
//
//   const locale = Convert.toLocale(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface Locale {
    main:    Main;
    ui:      UI;
    ingame:  Ingame;
    account: Account;
    profile: Profile;
    header:  Header;
    "":      Empty;
}

export interface Empty {
    "": string;
}

export interface Account {
    ui_switch_nickname:        string;
    ui_twitter_nickname:       string;
    ui_twitter_handle:         string;
    ui_information:            string;
    ui_friend_code:            string;
    ui_weekday_playtime:       string;
    ui_weekend_playtime:       string;
    ui_start_time:             string;
    ui_end_time:               string;
    ui_nickname:               string;
    ui_gender:                 string;
    ui_gender_placeholder:     string;
    ui_add_button:             string;
    ui_friend_code_link:       string;
    ui_additional_information: string;
}

export interface Header {
    ui_my_profile:              string;
    ui_login:                   string;
    ui_logout:                  string;
    ui_user_search_placeholder: string;
}

export interface Ingame {
    ui_information:              string;
    ui_summary:                  string;
    ui_weapon:                   string;
    ui_play_style:               string;
    ui_game_type:                string;
    ui_game_play_style_newbie:   string;
    ui_game_play_style_casual:   string;
    ui_game_play_style_hardcore: string;
    ui_rule_preference:          string;
    ui_x_match:                  string;
    ui_salmon_run:               string;
    ui_account_information:      string;
    ui_open:                     string;
    ui_regular:                  string;
    ui_drop_ins:                 string;
    ui_drop_ins_welcome:         string;
}

export interface Main {
    first_section_title:       string;
    first_section_description: string;
    first_section_button:      string;
}

export interface Profile {
    ui_upload_image_title:                                  string;
    ui_image_upload_button:                                 string;
    ui_image_upload_cancel_button:                          string;
    ui_image_upload_modal_drag_to_here:                     string;
    ui_image_upload_modal_drag_to_here_or_click:            string;
    ui_image_upload_modal_zoom_is_available_by_mouse_wheel: string;
    ui_image_upload_modal_zoom_is_available_by_pinch:       string;
    ui_update_plate_button:                                 string;
    ui_share_button:                                        string;
    ui_export_button:                                       string;
    ui_export_modal_title:                                  string;
    ui_export_modal_download_button_rendering_wait:         string;
    ui_export_modal_download_button:                        string;
    ui_plate_modal_title:                                   string;
    ui_plate_modal_confirm_button:                          string;
}

export interface UI {
    recent_users_title: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
    public static toLocale(json: string): Locale {
        return cast(JSON.parse(json), r("Locale"));
    }

    public static localeToJson(value: Locale): string {
        return JSON.stringify(uncast(value, r("Locale")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ''): never {
    const prettyTyp = prettyTypeName(typ);
    const parentText = parent ? ` on ${parent}` : '';
    const keyText = key ? ` for key "${key}"` : '';
    throw Error(`Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`);
}

function prettyTypeName(typ: any): string {
    if (Array.isArray(typ)) {
        if (typ.length === 2 && typ[0] === undefined) {
            return `an optional ${prettyTypeName(typ[1])}`;
        } else {
            return `one of [${typ.map(a => { return prettyTypeName(a); }).join(", ")}]`;
        }
    } else if (typeof typ === "object" && typ.literal !== undefined) {
        return typ.literal;
    } else {
        return typeof typ;
    }
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = '', parent: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key, parent);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val, key, parent);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases.map(a => { return l(a); }), val, key, parent);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue(l("Date"), val, key, parent);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue(l(ref || "object"), val, key, parent);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, key, ref);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key, ref);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val, key, parent);
    }
    if (typ === false) return invalidValue(typ, val, key, parent);
    let ref: any = undefined;
    while (typeof typ === "object" && typ.ref !== undefined) {
        ref = typ.ref;
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val, key, parent);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
    return { literal: typ };
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "Locale": o([
        { json: "main", js: "main", typ: r("Main") },
        { json: "ui", js: "ui", typ: r("UI") },
        { json: "ingame", js: "ingame", typ: r("Ingame") },
        { json: "account", js: "account", typ: r("Account") },
        { json: "profile", js: "profile", typ: r("Profile") },
        { json: "header", js: "header", typ: r("Header") },
        { json: "", js: "", typ: r("Empty") },
    ], false),
    "Empty": o([
        { json: "", js: "", typ: "" },
    ], false),
    "Account": o([
        { json: "ui_switch_nickname", js: "ui_switch_nickname", typ: "" },
        { json: "ui_twitter_nickname", js: "ui_twitter_nickname", typ: "" },
        { json: "ui_twitter_handle", js: "ui_twitter_handle", typ: "" },
        { json: "ui_information", js: "ui_information", typ: "" },
        { json: "ui_friend_code", js: "ui_friend_code", typ: "" },
        { json: "ui_weekday_playtime", js: "ui_weekday_playtime", typ: "" },
        { json: "ui_weekend_playtime", js: "ui_weekend_playtime", typ: "" },
        { json: "ui_start_time", js: "ui_start_time", typ: "" },
        { json: "ui_end_time", js: "ui_end_time", typ: "" },
        { json: "ui_nickname", js: "ui_nickname", typ: "" },
        { json: "ui_gender", js: "ui_gender", typ: "" },
        { json: "ui_gender_placeholder", js: "ui_gender_placeholder", typ: "" },
        { json: "ui_add_button", js: "ui_add_button", typ: "" },
        { json: "ui_friend_code_link", js: "ui_friend_code_link", typ: "" },
        { json: "ui_additional_information", js: "ui_additional_information", typ: "" },
    ], false),
    "Header": o([
        { json: "ui_my_profile", js: "ui_my_profile", typ: "" },
        { json: "ui_login", js: "ui_login", typ: "" },
        { json: "ui_logout", js: "ui_logout", typ: "" },
        { json: "ui_user_search_placeholder", js: "ui_user_search_placeholder", typ: "" },
    ], false),
    "Ingame": o([
        { json: "ui_information", js: "ui_information", typ: "" },
        { json: "ui_summary", js: "ui_summary", typ: "" },
        { json: "ui_weapon", js: "ui_weapon", typ: "" },
        { json: "ui_play_style", js: "ui_play_style", typ: "" },
        { json: "ui_game_type", js: "ui_game_type", typ: "" },
        { json: "ui_game_play_style_newbie", js: "ui_game_play_style_newbie", typ: "" },
        { json: "ui_game_play_style_casual", js: "ui_game_play_style_casual", typ: "" },
        { json: "ui_game_play_style_hardcore", js: "ui_game_play_style_hardcore", typ: "" },
        { json: "ui_rule_preference", js: "ui_rule_preference", typ: "" },
        { json: "ui_x_match", js: "ui_x_match", typ: "" },
        { json: "ui_salmon_run", js: "ui_salmon_run", typ: "" },
        { json: "ui_account_information", js: "ui_account_information", typ: "" },
        { json: "ui_open", js: "ui_open", typ: "" },
        { json: "ui_regular", js: "ui_regular", typ: "" },
        { json: "ui_drop_ins", js: "ui_drop_ins", typ: "" },
        { json: "ui_drop_ins_welcome", js: "ui_drop_ins_welcome", typ: "" },
    ], false),
    "Main": o([
        { json: "first_section_title", js: "first_section_title", typ: "" },
        { json: "first_section_description", js: "first_section_description", typ: "" },
        { json: "first_section_button", js: "first_section_button", typ: "" },
    ], false),
    "Profile": o([
        { json: "ui_upload_image_title", js: "ui_upload_image_title", typ: "" },
        { json: "ui_image_upload_button", js: "ui_image_upload_button", typ: "" },
        { json: "ui_image_upload_cancel_button", js: "ui_image_upload_cancel_button", typ: "" },
        { json: "ui_image_upload_modal_drag_to_here", js: "ui_image_upload_modal_drag_to_here", typ: "" },
        { json: "ui_image_upload_modal_drag_to_here_or_click", js: "ui_image_upload_modal_drag_to_here_or_click", typ: "" },
        { json: "ui_image_upload_modal_zoom_is_available_by_mouse_wheel", js: "ui_image_upload_modal_zoom_is_available_by_mouse_wheel", typ: "" },
        { json: "ui_image_upload_modal_zoom_is_available_by_pinch", js: "ui_image_upload_modal_zoom_is_available_by_pinch", typ: "" },
        { json: "ui_update_plate_button", js: "ui_update_plate_button", typ: "" },
        { json: "ui_share_button", js: "ui_share_button", typ: "" },
        { json: "ui_plate_modal_title", js: "ui_plate_modal_title", typ: "" },
        { json: "ui_plate_modal_confirm_button", js: "ui_plate_modal_confirm_button", typ: "" },
    ], false),
    "UI": o([
        { json: "recent_users_title", js: "recent_users_title", typ: "" },
    ], false),
};
