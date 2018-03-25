UPDATE dat_comm_file_reg 
	SET 
		load_count = (SELECT COUNT(trx_proc_state) FROM adt_trx_proc_state WHERE adt_trx_proc_state.file_id = 29),
        warning_count = (SELECT COUNT(trx_proc_state) FROM adt_trx_proc_state WHERE adt_trx_proc_state.file_id = 29 AND adt_trx_proc_state.trx_proc_state = 'W'),
		error_count = (SELECT COUNT(trx_proc_state) FROM adt_trx_proc_state WHERE adt_trx_proc_state.file_id = 29 AND adt_trx_proc_state.trx_proc_state = 'E'),
		valid_count = (SELECT COUNT(trx_proc_state) FROM adt_trx_proc_state WHERE adt_trx_proc_state.file_id = 29 AND adt_trx_proc_state.trx_proc_state = 'V')
WHERE dat_comm_file_reg.file_id = 29;