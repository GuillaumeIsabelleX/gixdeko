// var decoRes = require('DekoResult');
var tlid = require('tlid');
var debug = false;


// gixdeco.js
// ========
module.exports = {
    /**
     *  Extract the decorator from a string
     * 
     * @param {*} str 
     */
    get: function (str) {


        return extractDecorator2(str)
            ;
    },

    /**
     *  //@v Extract decorator as structured object 190113
     * //@a  GIXDeko.Package upgrade : @feature 1901131337 Considering Next line as same type or hierarchy if indented. 1901141700
     * //@result a dekos object is created and childs are added to it
     * 
     * @param {*} str 
     * @param {*} delimiter 
     * @param {*} includeTlido 
     * @param {*} keepOriginalText 
     * @param {*} ifIndentedConsiderNextLineAsSameIncludedType 
     */
    xtro: function (str, delimiter = "\n", includeTlido = false, keepOriginalText = false, ifIndentedConsiderNextLineAsSameIncludedType = true) {

        var otxt = str;
        var o = new Object();
        var r = [];



        if (keepOriginalText) o.text = str;

        if (otxt.indexOf(delimiter) > -1) {
            //parsing each lines
            var cmt = 0;
            otxt.split(delimiter).forEach(element => {
                // if (element.lenght > 2) {
                if (element != "" && element != " " && element != "," && element != "\n" && element != ".") {

                    var indentOfElement = getElementIndenting(element);

                    var rgeto = this.geto(element, false, includeTlido);

                    if (rgeto != null) {

                        r.push(rgeto);
                        //  r[cmt] = rgeto
                        cmt++;
                    }
                }
                // }
            });
        }
        else //parse one single line
        {
            var rgeto = this.geto(otxt);
            if (rgeto != null)
                r.push(rgeto);

        }
        o.results = r;


        return o;
    },
    /**
     * Get Deco from a  string with tlid (if any)
     * 
     * @param {*} str 
     * @param {*} notlid 
     * @param {*} includeTlido 
     * @param {*} includeIndent  create hierarchy with previous
     */
    geto: function (str, notlid = false, includeTlido = false, includeIndent = true) {

        var otxt = str;

        var reSTCDeco = /((@[a-zA-Z0-9._-]+))/g;

        if (this.has(str)) {
            var r = new Object();

            var decorator =
                this.get(otxt);
            if (includeIndent)
                r.indent = otxt.indexOf(decorator) - 1;



            r.deco = decorator;
            r.src = str;
            // var tlido = null;


            if (!notlid && tlid.has(str)) {
                var tlido = tlid.xtro(str);
                //  console.log(tlido);

                otxt = tlido.txt; //cleared from tlid text

                if (includeTlido) {
                    r.tlido = new Object();
                    r.tlido = tlido;
                    //    JSON.stringify(tlido);
                }
                r.tlid = tlido.tlid;
            }

            var clnTxt = this.cleanDecorator(decorator, otxt);
            r.txt = clnTxt;


            return r;
        }
        else return null;
    },
    /**
     * Clean a string of a deko
     * 
     * @param {*} decorator 
     * @param {*} txt 
     */
    cleanDecorator: function (decorator, txt) {
        var decostr = "@" + decorator;
        var r = txt
            .replace(decostr, "")
            .trim()
            ;
        if (debug) console.log(`Cleaning deco: ${decorator} in  ${txt}
        Result: ${r}
        `);


        return r;
    },
    /**
     * Tells us if we have a deco or not
     * @param {*} str 
     */
    has: function (str) {
        return (extractDecorator2(str) != "");
    },
    /**
     * Transform a deko result to jsons
     * 
     * @param {*} dekoObject 
     */
    toJSON: function (dekoObject) {
        return this.dekoResultToJson(dekoObject);
    },

    dekoResultToJson: dekoResultToJson,
    toDekoResult: toDekoResult,


};


var reSTCDeco = /((@[a-zA-Z0-9._-]+))/g;

/**
 * extraction decorator logics
 * 
 * @param {*} text 
 */
function extractDecorator2(text) {
    try {
        var email =
            text.match(reSTCDeco);
        //  console.log("DEBUG: reSTCDeco:" + email);
        var deco = email[0].split('@')[1];
        return deco;

    } catch (error) {
        return "";
    }
    // return text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
}




/**
 *  //@a 19011414 calculated the amout of space/tag on the beginning of the element and return it.
 * 
 * @param {*} element 
 */
function getElementIndenting(element) {

    return 0;
}






//------------Exported to JS Result-----------------------------------
//@cr 190112 JS Code from json result

// Generated by https://quicktype.io

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
function toDekoResult(json) {
    return cast(JSON.parse(json), "any");
}

function dekoResultToJson(value) {
    return JSON.stringify(uncast(value, "any"), null, 2);
}

function invalidValue(typ, val) {
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`);
}

function jsonToJSProps(typ) {
    if (typ.jsonToJS === undefined) {
        var map = {};
        typ.props.forEach((p) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ) {
    if (typ.jsToJSON === undefined) {
        var map = {};
        typ.props.forEach((p) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val, typ, getProps) {
    function transformPrimitive(typ, val) {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val);
    }

    function transformUnion(typs, val) {
        // val must validate against one typ in typs
        var l = typs.length;
        for (var i = 0; i < l; i++) {
            var typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) { }
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases, val) {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ, val) {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformObject(props, additional, val) {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        var result = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems") ? transformArray(typ.arrayItems, val)
                : typ.hasOwnProperty("props") ? transformObject(getProps(typ), typ.additional, val)
                    : invalidValue(typ, val);
    }
    return transformPrimitive(typ, val);
}

function cast(val, typ) {
    return transform(val, typ, jsonToJSProps);
}

function uncast(val, typ) {
    return transform(val, typ, jsToJSONProps);
}

function a(typ) {
    return { arrayItems: typ };
}

function u(...typs) {
    return { unionMembers: typs };
}

function o(props, additional) {
    return { props, additional };
}

function m(additional) {
    return { props: [], additional };
}

function r(name) {
    return { ref: name };
}

const typeMap = {
};
