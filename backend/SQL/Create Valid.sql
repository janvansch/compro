INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, adt_trx_proc_state.message)
  SELECT dat_transaction_data.file_id, dat_transaction_data.trx_id, 1201, 0, 'L', 'V', 'admin01', ''  
  FROM dat_transaction_data LEFT JOIN adt_trx_proc_state
	ON dat_transaction_data.trx_id = adt_trx_proc_state.trx_id		
WHERE dat_transaction_data.file_id = 29		
	AND adt_trx_proc_state.trx_id IS NULL
;