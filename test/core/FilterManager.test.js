// Created by nullice on 2018/05/17 - 14:58 

import FilterManager from "./../../src/Core/FilterManager/FilterManager.js"

const NODE_KEY = "[GOB:FILTERS NODE]"

describe("FilterManager Class", () =>
{
    let fm = new FilterManager()
    test("fm.filters init", () =>
    {
        expect(fm.filters.fin).toEqual({})
        expect(fm.filters.get).toEqual({})
        expect(fm.filters.pre).toEqual({})
    })

    test("fm.newFilter()", () =>
    {
        let func = async function (value)
        {
            console.log("preFilter value")
        }
        let newFilter = fm.newFilter(["a", "b", "c"], "pre", func)
        expect(newFilter.level).toBe(5)
        expect(newFilter.name).toBe("")
        expect(newFilter.isAsync).toBe(true)
        expect(newFilter.type).toBe("pre")
        expect(newFilter.path).toEqual(["a", "b", "c"])
        console.log(newFilter)
    })

    test("fm.addFilter()", () =>
    {
        let func = async function (value)
        {
            console.log("preFilter value")
        }
        let newFilter = fm.newFilter(["a", "b", "c"], "pre", func)
        fm.addFilter(newFilter)

        expect(Array.isArray(fm.filters.pre.a.b.c[NODE_KEY])).toBe(true)
        expect(fm.filters.pre.a.b.c[NODE_KEY].length).toBe(1)

        // console.log(JSON.stringify(fm,null,4))
    })

    test("fm.getFilter() & removeFilter()", () =>
    {
        function addFilter(type = "pre")
        {
            let func = async function (value)
            {
            }
            let f1 = fm.newFilter(["a", "b", "c"], type, func)
            fm.addFilter(f1)

            let f2 = fm.newFilter(["a", "b"], type, func)
            fm.addFilter(f2)

        }

        addFilter()
        addFilter()
        addFilter("fin")
        addFilter("get")


        let filters_pre = fm.getFilters(["a", "b", "c"], "pre")
        expect(Array.isArray(filters_pre)).toBe(true)
        expect(filters_pre.length > 2).toBe(true)
        for (let pre of  filters_pre)
        {
            expect(pre.type).toBe("pre")
            expect(pre.path).toEqual(["a", "b", "c"])
        }

        let filters_fin = fm.getFilters(["a", "b"], "fin")
        expect(Array.isArray(filters_fin)).toBe(true)
        expect(filters_fin.length).toBe(1)
        for (let fin of  filters_fin)
        {
            expect(fin.type).toBe("fin")
            expect(fin.path).toEqual(["a", "b"])
        }
    })

    test("fm.removeFilter()", () =>
    {
        let func = async function (value)
        {
        }
        let newFilter = fm.newFilter(["a", "b", "c"], "pre", func, "test1")
        fm.addFilter(newFilter)

        let filters = fm.getFilters(["a", "b", "c"], "pre")
        expect(filters.includes(newFilter)).toBe(true)

        fm.removeFilter(newFilter)
        filters = fm.getFilters(["a", "b", "c"], "pre")
        expect(filters.includes(newFilter)).toBe(false)
    })

    test("fm.removeFilter() <globFilter>", () =>
    {
        let func = async () =>
        {
        }

        // -------
        let newFilter = fm.newFilter("a.*.c", "pre", func, "test1")
        fm.addFilter(newFilter)
        let filters = fm.getFilters(["a", "b", "c"], "pre")
        expect(filters.includes(newFilter)).toBe(true)

        fm.removeFilter(newFilter)
        filters = fm.getFilters(["a", "b", "c"], "pre")
        expect(filters.includes(newFilter)).toBe(false)
        // -------
        newFilter = fm.newFilter(/^a.+/, "pre", func, "test1")
        fm.addFilter(newFilter)
        filters = fm.getFilters(["a", "b", "c"], "pre")
        expect(filters.includes(newFilter)).toBe(true)

        fm.removeFilter(newFilter)
        filters = fm.getFilters(["a", "b", "c"], "pre")
        expect(filters.includes(newFilter)).toBe(false)

    })


    test("fm.getFilter() <globFilter>", () =>
    {
        let fm = new FilterManager()
        let func = async () =>
        {
        }

        // -------
        let newFilter_1 = fm.newFilter("a.*.c", "pre", func, "test1")
        fm.addFilter(newFilter_1)
        let newFilter_2 = fm.newFilter("a.b.*", "pre", func, "test2")
        fm.addFilter(newFilter_2)
        let newFilter_3 = fm.newFilter(/^a.+/, "pre", func, "test3")
        fm.addFilter(newFilter_3)

        let filters = fm.getFilters(["a", "b", "c"], "pre")
        expect(filters.includes(newFilter_1)).toBe(true)
        expect(filters.includes(newFilter_2)).toBe(true)
        expect(filters.includes(newFilter_3)).toBe(true)

        filters = fm.getFilters(["a", "b", "d"], "pre")
        expect(filters.includes(newFilter_1)).toBe(false)
        expect(filters.includes(newFilter_2)).toBe(true)
        expect(filters.includes(newFilter_3)).toBe(true)

        filters = fm.getFilters(["x", "a", "c"], "pre")
        expect(filters.includes(newFilter_1)).toBe(false)
        expect(filters.includes(newFilter_2)).toBe(false)
        expect(filters.includes(newFilter_3)).toBe(false)
    })

})


describe("FilterManager Error", () =>
{
    test("fm.newFilter()", () =>
    {
        var m = null
        let fm = new FilterManager()
        try
        {
            fm.newFilter(32, "fin", () =>
            {
            })
        }
        catch (e)
        {
            m = e.message.slice(0, 5)
        }
        expect(m).toBe("[Gob]")

        // ---------------
        m = null
        try
        {
            fm.newFilter(["a"], "xxx", () =>
            {
            })
        }
        catch (e)
        {
            m = e.message.slice(0, 5)
        }
        expect(m).toBe("[Gob]")

        // ---------------

        m = null
        try
        {
            fm.newFilter(["a"], "", "func")
        }
        catch (e)
        {
            m = e.message.slice(0, 5)
        }

        expect(m).toBe("[Gob]")
    })
})
