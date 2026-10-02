-- Run this once in Supabase SQL Editor for an existing portfolio bucket.
-- It allows CSV, Excel and Power BI files to be uploaded through Admin > Media.
-- It does not change any project content or published records.

update storage.buckets
set allowed_mime_types = array[
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'video/mp4',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream'
]::text[]
where id = 'portfolio';

select id, allowed_mime_types
from storage.buckets
where id = 'portfolio';
