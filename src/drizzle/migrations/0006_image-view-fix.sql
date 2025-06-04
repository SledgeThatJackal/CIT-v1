DROP VIEW IF EXISTS image_find;

CREATE VIEW image_find AS
SELECT
    c."barcodeId", null AS "itemId", it."fileName"
FROM containers c
INNER JOIN container_images ci ON c.id = ci."containerId"
INNER JOIN images it ON ci."imageId" = it.id

UNION

SELECT
    c."barcodeId", i.id AS "itemId", it."fileName"
FROM items i
INNER JOIN item_images ii ON i.id = ii."itemId"
INNER JOIN images it ON ii."imageId" = it.id
INNER JOIN container_items ci ON i.id = ci."itemId"
INNER JOIN containers c ON c.id = ci."containerId";