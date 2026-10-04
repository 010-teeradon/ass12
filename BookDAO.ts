import { Book } from './Book.ts';
import { BaseDAO } from './BaseDAO.ts';

type BookRow = { id: number; isbn: string; title: string; author: string; isAvailable: number };

export class BookDAO extends BaseDAO {
  protected initTable(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        isbn TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isAvailable INTEGER NOT NULL DEFAULT 1
      )
    `);
  }

  private toBook(row: BookRow): Book {
    return new Book(row.id, row.isbn, row.title, row.author, row.isAvailable === 1);
  }

  public addBook(isbn: string, title: string, author: string): boolean {
    try {
      const stmt = this.db.prepare('INSERT INTO books(isbn, title, author, isAvailable) VALUES (?,?,?,1)');
      const result = stmt.run(isbn, title, author);
      return result.changes > 0;
    } catch (error) {
      return false; 
    }
  }

  public findBookByIsbn(isbn: string): Book | null {
    const stmt = this.db.prepare('SELECT * FROM books WHERE isbn = ?');
    const row = stmt.get(isbn) as BookRow | undefined;
    if (!row) return null;
    return this.toBook(row);
  }

  public updateAvailability(isbn: string, isAvailable: boolean): boolean {
    const stmt = this.db.prepare('UPDATE books SET isAvailable = ? WHERE isbn = ?');
    const result = stmt.run(isAvailable ? 1 : 0, isbn);
    return result.changes > 0;
  }

  public findAll(): Book[] {
    const stmt = this.db.prepare('SELECT * FROM books');
    const rows = stmt.all() as BookRow[];
    return rows.map(row => this.toBook(row));
  }
}