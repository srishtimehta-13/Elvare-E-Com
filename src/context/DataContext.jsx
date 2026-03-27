import axios from "axios";
import { createContext, useContext, useState, useEffect, useCallback } from "react";

export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    // fetching all products from api
    const fetchAllProducts = useCallback(async () => {
        try {
            setLoading(true)
            setError("")
            const res = await axios.get('https://dummyjson.com/products')
            const productsData = res.data.products
            setData(productsData)
        } catch (error) {
            console.log(error)
            setError("Unable to load products right now. Please try again.")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAllProducts()
    }, [fetchAllProducts])

    const getUniqueCategory = (data, property) => {
        // Safety check: if data is empty, don't try to map it yet
        if (!data || data.length === 0) return ["All"]

        let newVal = data.map((curElem) => {
            return curElem[property]
        })
        newVal = ["All", ...new Set(newVal)]
        return newVal
    }

    const categoryOnlyData = getUniqueCategory(data, "category").filter((item) => item !== "All")
    const brandOnlyData = getUniqueCategory(data, "brand").filter((item) => item !== "All")

    return (
        <DataContext.Provider value={{ data, setData, fetchAllProducts, categoryOnlyData, brandOnlyData, loading, error }}>
            {children}
        </DataContext.Provider>
    )
}

export const useData = () => useContext(DataContext)