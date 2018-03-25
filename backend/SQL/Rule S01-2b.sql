INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id,  proc_type, trx_proc_state, user_id, message)
	SELECT file_id, trx_id, '1200', 'L', 'E', 'admin01', '{S01:Invalid insurance company code}'  
	FROM dat_transaction_data JOIN (
			SELECT ins_co_code 
				FROM dat_prod_provider INNER JOIN dat_transaction_data 
					ON dat_transaction_data.insurance_co_code = dat_prod_provider.ins_co_code
			) AS x
	WHERE file_id = 29 AND 
		 dat_transaction_data.insurance_co_code != x.ins_co_code
	ON DUPLICATE KEY UPDATE message= VALUES (message)+('{S01:Invalid insurance company code*}')	
;



SELECT left_tbl.*
  FROM left_tbl LEFT JOIN right_tbl ON left_tbl.id = right_tbl.id
  WHERE right_tbl.id IS NULL;