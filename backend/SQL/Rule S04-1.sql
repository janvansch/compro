INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id,  proc_type, trx_proc_state, user_id, message)
	SELECT file_id, trx_id, '1201', 'L', 'E', 'admin01', '{S04:Policy number requied}'  
	FROM dat_transaction_data
	WHERE file_id = 29 AND 
		 dat_transaction_data.policy_no IS NULL
	ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S04:Policy number required*}')	
;