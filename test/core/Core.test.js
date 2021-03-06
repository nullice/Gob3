// Created by nullice on 2018/04/17 - 17:55 

// import Gob from "./../../dist/Gob.umd.js"
import Gob from "./../../src/index.js"


const GOB_CORE_NAME = "[Gob Core]"


test("Gob() is Gob3", () =>
{
    let gob = Gob()
    expect(typeof  gob[GOB_CORE_NAME]).toBe("object")
})

test("Gob.inspect() ", () =>
{
    let gob = Gob()
    let core = Gob.inspect(gob)
    expect(core.isGob).toBe(3)


    let err = null
    try
    {
        Gob.inspect({})
    }
    catch (e)
    {
        err = e
    }
    expect(err === null).toBe(false)
})


test("Set base type", () =>
{
    let gob = Gob()
    let date = new Date()
    gob.a = 1
    gob.b = "string"
    gob.c = date
    expect(gob.a).toBe(1)
    expect(gob.b).toBe("string")
    expect(gob.c).toBe(date)
})


describe("Set object", () =>
{
    let gob = Gob()
    let date = new Date()
    gob.a = "a"
    gob.b = "b"
    gob.c = "c"

    test("Simple object", () =>
    {
        gob.obA = {
            apple: {
                type: "水果",
                length: 32
            }
        }

        expect(typeof gob.obA).toBe("object")
        expect(typeof gob.obA.apple).toBe("object")
        expect(gob.obA.apple.type).toBe("水果")
        expect(gob.obA.apple.length).toBe(32)

        expect(gob.a).toBe("a")
        expect(gob.b).toBe("b")
        expect(gob.c).toBe("c")
    })


    test("Object compare", () =>
    {
        let obB = {
            hai: 123,
            ezGo: 123,
            c: {s: {x: {g: {x: 123}}}}
        }

        gob.obA.apple.o = obB

        // 由于返回的是 porxy 对象，所以不相等
        expect(gob.obA.apple.o == obB).toBe(false)

        // 基本对象是相等的
        expect(gob.obA.apple.o.hai == obB.hai).toBe(true)

    })

    test("Object replace", () =>
    {
        gob.obA.apple.o = {
            x: 123,
            d: {cc: {ee: 3344}}
        }
        expect(gob.obA.apple.o.d.cc.ee == 3344).toBe(true)
        expect(gob.obA.apple.o.x == 123).toBe(true)

    })
})


describe("Set Cycle object", () =>
{
    var gob = Gob()
    gob.a = "a"
    gob.b = "b"
    gob.c = "c"

    test("Simple cycle object", () =>
    {
        var obA = {name: "obA"}
        var obB = {name: "obB"}

        obA.toB = obB
        obB.toA = obA
        gob.obA = obA

        expect(gob.obA.name).toBe("obA")
        expect(gob.obA.toB.name).toBe("obB")
        expect(gob.obA.toB.toA.name).toBe("obA")
        expect(gob.obA.toB.toA.toB.name).toBe("obB")
        expect(gob.obA.toB.toA.toB.toA.name).toBe("obA")
        expect(gob.obA.toB.toA.toB.toA.toB.name).toBe("obB")
        expect(gob.obA.toB.toA.toB.toA.toB.toA.name).toBe("obA")
        expect(gob.obA.toB.toA.toB.toA.toB.toA.toB.name).toBe("obB")
        expect(gob.obA.toB.toA.toB.toA.toB.toA.toB).toBe(gob.obA.toB.toA.toB.toA.toB)
        expect(gob.obA.toB.toA.toB.toA).toBe(gob.obA)


        expect(gob.a).toBe("a")
        expect(gob.b).toBe("b")
        expect(gob.c).toBe("c")
    })

    test("Simple cycle object $set()", () =>
    {
        var obA = {name: "obA"}
        var obB = {name: "obB"}

        obA.toB = obB
        obB.toA = obA
        gob.$set("obA", obA)

        expect(gob.obA.name).toBe("obA")
        expect(gob.obA.toB.name).toBe("obB")
        expect(gob.obA.toB.toA.name).toBe("obA")
        expect(gob.obA.toB.toA.toB.name).toBe("obB")
        expect(gob.obA.toB.toA.toB.toA.name).toBe("obA")
        expect(gob.obA.toB.toA.toB.toA.toB.name).toBe("obB")
        expect(gob.obA.toB.toA.toB.toA.toB.toA.name).toBe("obA")
        expect(gob.obA.toB.toA.toB.toA.toB.toA.toB.name).toBe("obB")
        expect(gob.obA.toB.toA.toB.toA.toB.toA.toB).toBe(gob.obA.toB.toA.toB.toA.toB)
        expect(gob.obA.toB.toA.toB.toA).toBe(gob.obA)


        expect(gob.a).toBe("a")
        expect(gob.b).toBe("b")
        expect(gob.c).toBe("c")
    })

    //todo:没完成复杂循环引用测试
    test("Complex cycle object", () =>
    {
        var ob = {
            name: "ob",
            info: {
                name: "info",
                info2: {
                    name: "info2",
                    info3: {
                        name: "info3",

                    },
                    info4: {
                        name: "info4"
                    }
                },
            }
        }

        ob.info.info2.info3.toInfo4 = ob.info.info2.info4
        ob.info.info2.info4.toInfo3 = ob.info.info2.info3
        ob.info.info2.info4.toInfo = ob.info
        ob.info.info2.info3.toInfo = ob.info
        ob.info.info2.info4.toInfo2 = ob.info2
        ob.info.info2.info3.toInfo2 = ob.info2


        expect(ob.info.info2.info3.toInfo4.name).toBe("info4")
        expect(ob.info.info2.info4.toInfo3.name).toBe("info3")
        expect(ob.info.info2.info4.toInfo.name).toBe("info")
        expect(ob.info.info2.info3.toInfo.name).toBe("info")
        expect(ob.info.info2.info3.toInfo.info2.name).toBe("info2")
        expect(ob.info.info2.info3.toInfo.info2.info4.toInfo3.name).toBe("info3")
        expect(ob.info.info2.info3.toInfo.info2.info4.toInfo3.toInfo4.toInfo.name).toBe("info")
        expect(ob.info.info2.info3.toInfo.info2.info4.toInfo3.toInfo4.toInfo).toBe(ob.info)

        gob.ob = ob
        // expect(gob.ob.info.info2.info3.toInfo4.name).toBe("info4")
        // expect(gob.ob.info.info2.info4.toInfo3.name).toBe("info3")
        // expect(gob.ob.info.info2.info4.toInfo.name).toBe("info")
        // expect(gob.ob.info.info2.info3.toInfo.name).toBe("info")
        // expect(gob.ob.info.info2.info3.toInfo.info2.name).toBe("info2")
        // expect(gob.ob.info.info2.info3.toInfo.info2.info4.toInfo3.name).toBe("info3")
        // expect(gob.ob.info.info2.info3.toInfo.info2.info4.toInfo3.toInfo4.toInfo.name).toBe("info")
        // expect(gob.ob.info.info2.info3.toInfo.info2.info4.toInfo3.toInfo4.toInfo).toBe(ob.info)


    })
})


describe("Delete ", () =>
{


    test("Delete object", () =>
    {
        let gob = Gob({
            obA: {
                apple: {
                    type: "水果",
                    length: 32
                },

            }
        })

        gob.obB = {a: {v: 13}}
        expect(gob.obA.apple.type).toBe("水果")
        expect(gob.obA.apple.length).toBe(32)
        expect(gob.obA.apple.length).toBe(32)
        expect(gob.obB.a.v).toBe(13)
        delete  gob.obA.apple.type
        delete  gob.obA.apple.length
        expect(gob.obA.apple.type).toBe(undefined)
        expect(gob.obA.apple.length).toBe(undefined)
        expect(typeof  gob.obA.apple).toBe("object")
    })

})
