UPDATE dat_transaction_data
SET marketers_code='11111111'
WHERE marketers_code IS NULL
	AND file_id = 29
    AND trx_type = 'F'
;