INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, 1201, 0, 'L', 'E', 'admin01', '{S15:Invalid branch agent code}'  
  FROM dat_transaction_data LEFT JOIN dat_entity_link
	ON dat_transaction_data.branch_agent = dat_entity_link.branch_agent_code
  WHERE file_id = 29 AND 
		dat_entity_link.branch_agent_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S15:Invalid branch agent code*}')			
;