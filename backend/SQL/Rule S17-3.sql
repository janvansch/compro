INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT currtrx.file_id, currtrx.trx_id, 1201, 0, 'L', 'W', 'admin01', '{S17:Warning - marketers code 2 history mismatch}'  
  FROM dat_transaction_data AS currtrx LEFT JOIN dat_transaction_data AS history
	ON currtrx.policy_no = history.policy_no 
		AND CAST(currtrx.period AS UNSIGNED INTEGER) = CAST(history.period AS UNSIGNED INTEGER) + 1  
  WHERE currtrx.file_id = 29 
	AND history.marketers_code_2 IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S17:Warning - marketers code 2 history mismatch*}')			
;