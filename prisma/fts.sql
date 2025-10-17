CREATE VIRTUAL TABLE IF NOT EXISTS page_fts USING fts5(pageId UNINDEXED, content);
INSERT INTO page_fts(pageId,content) SELECT id,title FROM Page;
