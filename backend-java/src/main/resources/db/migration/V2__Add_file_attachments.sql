-- Add file_attachments column to messages table
ALTER TABLE messages ADD COLUMN file_attachments JSON;
