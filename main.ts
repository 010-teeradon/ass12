import { BookDAO } from './BookDAO.ts';
import { BorrowRecordDAO } from './BorrowRecordDAO.ts';

const bookDAO = new BookDAO();
const borrowDAO = new BorrowRecordDAO();

bookDAO.addBook('ISBN-101', 'Clean Code', 'Robert C. Martin');
bookDAO.addBook('ISBN-102', 'The Pragmatic Programmer', 'Andrew Hunt');

console.log('--- ทดสอบเพิ่ม ISBN ซ้ำ ---');
console.log(bookDAO.addBook('ISBN-101', 'Dup', 'Dup'));

console.log('--- ทดสอบ getInfo ---');
console.log(bookDAO.findBookByIsbn('ISBN-101')?.getInfo());

console.log('--- ทดสอบยืมหนังสือ ---');
console.log(borrowDAO.borrowBook('สมชาย', 'ISBN-101')); 
console.log(borrowDAO.borrowBook('สมศรี', 'ISBN-101')); 
console.log(borrowDAO.borrowBook('สมชาย', 'ISBN-999')); 

console.log('--- หนังสือทั้งหมด ---');
bookDAO.findAll().forEach(b => console.log(b.getInfo()));