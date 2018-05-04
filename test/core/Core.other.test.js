// import Gob from "./../../dist/Gob.umd.js"
import Gob from "./../../src/index.js"


const GOB_CORE_NAME = "[Gob Core]"


describe("Core other", () =>
{


    test("Operate [Gob Core]", () =>
    {


        var gob = Gob({a: 1222}, {syncLog: true, disableLog: false})
        gob.$set(GOB_CORE_NAME, 123)
        expect(gob[GOB_CORE_NAME].isGob).toBe(3)
        var c = gob.$get(GOB_CORE_NAME)
        expect(c.isGob).toBe(3)
        gob.$delete(GOB_CORE_NAME)
        expect(gob[GOB_CORE_NAME].isGob).toBe(3)
    })


    test("Opiton", () =>
    {

        var gob0 = Gob({a: 1222}, {disableLog: true})
        gob0.a = 1232
        expect(gob0.a).toBe(1232)
        expect(gob0.$get("a")).toBe(1232)



        var gob1 = Gob({a: 1222}, {disableLog: false,syncLog: true,})
        gob1.a = 1232
        expect(gob1.a).toBe(1232)
        expect(gob1.$get("a")).toBe(1232)
    })



})
