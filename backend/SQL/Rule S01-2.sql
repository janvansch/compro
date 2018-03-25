INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id,  proc_type, trx_proc_state, user_id, message)
	SELECT file_id, trx_id, '1201', 'L', 'E', 'admin01', '{S01:Invalid insurance company code}'  
	FROM dat_transaction_data LEFT JOIN dat_prod_provider 
		ON dat_transaction_data.insurance_co_code = dat_prod_provider.ins_co_code
	WHERE file_id = 29 AND 
		 dat_prod_provider.ins_co_code IS NULL
	ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S01:Invalid insurance company code*}')	
;

