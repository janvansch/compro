INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, 1201, 0, 'L', 'E', 'admin01', '{SO3:Invalid adviser code}'  
  FROM dat_transaction_data LEFT JOIN dat_agent_profile
	ON dat_transaction_data.source_code = dat_agent_profile.adviser_code
  WHERE file_id = 29 AND 
		dat_agent_profile.adviser_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{SO3:Invalid adviser code*}')			
;

