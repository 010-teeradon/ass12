import { BaseDAO } from './BaseDAO.ts';
import { BookDAO } from './BookDAO.ts';

export class BorrowRecordDAO extends BaseDAO {
  protected initTable(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS borrow_records (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        borrowerName TEXT NOT NULL,
        bookIsbn TEXT NOT NULL,
        borrowDate TEXT NOT NULL
      )
    `);
  }

  public borrowBook(borrowerName: string, isbn: string): boolean {
    const bookDAO = new BookDAO();


    const book = bookDAO.findBookByIsbn(isbn);
    if (!book) {
      console.log('ไม่พบหนังสือรายการนี้');
      return false;
    }

    if (!book.getIsAvailable()) {
      console.log(`หนังสือ ${book.getTitle()} ถูกยืมไปแล้ว`);
      return false;
    }

    const doBorrow = this.db.transaction(() => {
      this.db
        .prepare('INSERT INTO borrow_records(borrowerName, bookIsbn, borrowDate) VALUES (?,?,?)')
        .run(borrowerName, isbn, new Date().toISOString());

      const result = this.db
        .prepare('UPDATE books SET isAvailable = 0 WHERE isbn = ?')
        .run(isbn);
      if (result.changes === 0) throw new Error('update failed');
    });

    try {
      doBorrow();
      console.log(`${borrowerName} ยืม ${book.getTitle()} เรียบร้อยแล้ว`);
      return true;
    } catch (error) {
      console.log('ยืมไม่สำเร็จ ยกเลิกรายการ (rollback)');
      return false;
    }
  }
}