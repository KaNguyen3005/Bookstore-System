{/*import { useEffect, useState } from "react"
   import { getBooks } from "../services/bookService"
   import { Book } from "../types/Book"

   function Home() {

     const [books, setBooks] = useState<Book[]>([])

     useEffect(() => {
       getBooks().then((data) => {
         setBooks(data)
       })
     }, [])

     return (
       <div>
         <h2>Book List</h2>

         {books.map(book => (
           <div key={book.id}>
             <p>{book.title}</p>
             <p>{book.price}</p>
           </div>
         ))}
       </div>
     )
   }

   export default Home */}

import { Book } from "../types/Book"

const mockBooks: Book[] = [
  {
    id: 1,
    title: "Clean Code",
    price: 120000,
    author: "Robert C. Martin"
  },
  {
    id: 2,
    title: "Atomic Habits",
    price: 90000,
    author: "James Clear"
  },
  {
    id: 3,
    title: "Deep Work",
    price: 110000,
    author: "Cal Newport"
  }
]

export const getBooks = async (): Promise<Book[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockBooks)
    }, 500) // giả lập gọi API
  })
}