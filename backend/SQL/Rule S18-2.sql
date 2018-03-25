INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, 1201, 0, 'L', 'E', 'admin01', '{S17:Invalid marketers code 3}'  
  FROM dat_transaction_data LEFT JOIN dat_agent_profile
	ON dat_transaction_data.marketers_code_3 = dat_agent_profile.adviser_code
  WHERE file_id = 29
	AND dat_transaction_data.marketers_code_3 IS NOT NULL
    AND dat_transaction_data.marketers_code_3 != '0'
    AND dat_transaction_data.marketers_code_3 != '00000000'
	AND dat_agent_profile.adviser_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S17:Invalid marketers code 3*}')			
;