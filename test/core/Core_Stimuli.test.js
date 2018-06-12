// Created by nullice on 2018/04/17 - 17:55 

// import Gob from "./../../dist/Gob.umd.js"
import Gob from "./../../src/index.js"


describe("$get, $set", () =>
{
    test("$get", () =>
        {
            let gob = Gob()
            gob.x = "123"
            expect(gob.$get("x")).toBe("123")

            gob.x = {a: {b: 55}}
            expect(gob.$get("x.a.b")).toBe(55)

            gob.x = {a: {b: 55}}
            expect(gob.$get("x.a")).toEqual({b: 55})

            gob.e = {a: {b: undefined}}
            expect(gob.$get("e.a.b")).toBe(undefined)
        }
    )
    test("$set", () =>
        {
            let gob = Gob()
            gob.$set(["x"], "123")
            expect(gob.$get("x")).toBe("123")

            gob.$set(["x"], {a: {b: 55}})
            expect(gob.$get("x.a.b")).toBe(55)

            gob.$set(["x"], {a: {b: 55}})
            expect(gob.$get("x.a")).toEqual({b: 55})

            gob.$set(["e"], {a: {b: undefined}})
            expect(gob.$get("e.a.b")).toBe(undefined)
        }
    )

    test("$delete", () =>
    {
        let gob = Gob()
        gob.obA = {
            apple: {
                type: "水果",
                length: 32
            },
        }

        gob.obB = {a: {v: 13}}
        expect(gob.obA.apple.type).toBe("水果")
        expect(gob.obA.apple.length).toBe(32)
        expect(gob.obB.a.v).toBe(13)

        gob.$delete("obA.apple.type")
        gob.$delete("obA.apple.length")
        gob.$delete(["obA", "apple", "type"])
        gob.$delete("obB")

        expect(gob.obA.apple.type).toBe(undefined)
        expect(gob.obA.apple.length).toBe(undefined)
        expect(typeof  gob.obA.apple).toBe("object")
        expect(typeof  gob.obB).toBe("undefined")
    })

})

describe("StimuliBus Log",  () =>
{
    let gob = Gob({}, {logType: {get: true}})
    let core = Gob.inspect(gob)


    test("recorder.getLatestStimuliInfo() raw get", () =>
        {
            gob.a
            var sign = core.recorder.getLatestStimuliInfo()

            expect(sign.type).toBe("get")
            expect(sign.path).toEqual(["a"])

        }
    )

    test("stimuliLog.indexes", () =>
        {
            expect(core.recorder.logs.indexes.all).toBe(1)
            expect(core.recorder.logs.indexes.get).toBe(1)
            expect(core.recorder.logs.indexes.set).toBe(0)
            expect(core.recorder.logs.indexes.delete).toBe(0)
        }
    )

    test("recorder.getLatestStimuliInfo() $get", () =>
        {
            gob.$get(["a"])
            var sign = core.recorder.getLatestStimuliInfo()
            expect(sign.type).toBe("get")
            expect(sign.path).toEqual(["a"])
        }
    )

    test("stimuliLog.indexes", () =>
        {
            expect(core.recorder.logs.indexes.all).toBe(2)
            expect(core.recorder.logs.indexes.get).toBe(2)
            expect(core.recorder.logs.indexes.set).toBe(0)
            expect(core.recorder.logs.indexes.delete).toBe(0)
        }
    )

    test("recorder.getLatestStimuliInfo() $set", () =>
        {
            gob.$set(["o"], {a: {b: 123}})
            var sign = core.recorder.getLatestStimuliInfo()
            expect(sign.type).toBe("set")
            expect(sign.path).toEqual(["o"])

        }
    )

    test("stimuliLog.indexes", () =>
        {
            expect(core.recorder.logs.indexes.all).toBe(3)
            expect(core.recorder.logs.indexes.get).toBe(2)
            expect(core.recorder.logs.indexes.set).toBe(1)
            expect(core.recorder.logs.indexes.delete).toBe(0)
        }
    )


    test("recorder.getLatestStimuliInfo() raw delete", () =>
        {
            gob.o.a.b = 123
            delete gob.o.a.b
            var sign = core.recorder.getLatestStimuliInfo()
            expect(sign.type).toBe("delete")
            expect(gob.o.a.b).toBe(undefined)
            expect(sign.path).toEqual(["o", "a", "b"])
        }
    )

    test("stimuliLog.indexes", () =>
        {
            expect(core.recorder.logs.indexes.set).toBe(2)
            expect(core.recorder.logs.indexes.delete).toBe(1)
        }
    )
    test("recorder.getLatestStimuliInfo() $set", () =>
        {
            gob.o.a.b = 444
            gob.$delete("o.a.b")
            var sign = core.recorder.getLatestStimuliInfo()
            expect(sign.type).toBe("delete")
            expect(gob.o.a.b).toBe(undefined)
            expect(sign.path).toEqual(["o", "a", "b"])
        }
    )
    test("stimuliLog.indexes", () =>
        {
            expect(core.recorder.logs.indexes.set).toBe(3)
            expect(core.recorder.logs.indexes.delete).toBe(2)
        }
    )
})
