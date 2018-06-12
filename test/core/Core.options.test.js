// import Gob from "./../../dist/Gob.umd.js"
import Gob from "./../../src/index.js"


const GOB_CORE_NAME = "[Gob Core]"


describe("Gob options.logType ", () =>
{

    test("Gob options.logType.set = false ", () =>
    {
        var gob = Gob({a: 1222}, {logType: {set: false}})
        gob.a = 222
        gob.$set("a", 233)
        var sign = gob[GOB_CORE_NAME].recorder.getLatestStimuliInfo()
        expect(sign).toBe(undefined)
    })

    test("Gob options.logType.get default", () =>
    {
        var gob = Gob({a: 1222}, {})
        gob.a = 222
        gob.a
        var sign = gob[GOB_CORE_NAME].recorder.getLatestStimuliInfo()
        expect(sign.type !== "get").toBe(true)
    })

    test("Gob options.logType.get  = true", () =>
    {
        var gob = Gob({a: 1222}, {logType: {get: true}})
        gob.a = 222
        gob.a
        var sign = gob[GOB_CORE_NAME].recorder.getLatestStimuliInfo()
        expect(sign.type == "get").toBe(true)
        expect(sign.path).toEqual(["a"])
    })

    test("Gob options.logType.delete default", () =>
    {
        var gob = Gob({a: 1222}, {})
        delete gob.a
        var sign = gob[GOB_CORE_NAME].recorder.getLatestStimuliInfo()
        expect(sign.type).toBe("delete")
    })


    test("Gob options.logType.delete = false ", () =>
    {
        var gob = Gob({a12: 1222}, {logType: {delete: false}})
        delete gob.a12
        var sign = gob[GOB_CORE_NAME].recorder.getLatestStimuliInfo()
        expect(sign.type !== "delete").toBe(true)
    })


})
