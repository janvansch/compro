CREATE DEFINER=`root`@`localhost` PROCEDURE `new_procedure`()
-- Apply ERROR Rules
BEGIN
-- S01-2 validate insurance company code - product provider
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id,  proc_type, trx_proc_state, user_id, message)
	SELECT file_id, trx_id, '1201', 'L', 'E', 'admin01', '{S01:Invalid insurance company code}'  
	FROM dat_transaction_data LEFT JOIN dat_prod_provider 
		ON dat_transaction_data.insurance_co_code = dat_prod_provider.ins_co_code
	WHERE file_id = 29 AND 
		 dat_prod_provider.ins_co_code IS NULL
	ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S01:Invalid insurance company code*}')
;
-- S03-3 validate source code - agent profile
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, 1201, 0, 'L', 'E', 'admin01', '{SO3:Invalid adviser code}'  
  FROM dat_transaction_data LEFT JOIN dat_agent_profile
	ON dat_transaction_data.source_code = dat_agent_profile.adviser_code
  WHERE file_id = 29 AND 
		dat_agent_profile.adviser_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{SO3:Invalid adviser code*}')			
;
-- S04-1 validate policy number provided
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id,  proc_type, trx_proc_state, user_id, message)
	SELECT file_id, trx_id, '1201', 'L', 'E', 'admin01', '{S04:Policy number requied}'  
	FROM dat_transaction_data
	WHERE file_id = 29 AND 
		 dat_transaction_data.policy_no IS NULL
	ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S04:Policy number required*}')	
;
-- S15-3 validate branch agent - entity link
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, 1201, 0, 'L', 'E', 'admin01', '{S15:Invalid branch agent code}'  
  FROM dat_transaction_data LEFT JOIN dat_entity_link
	ON dat_transaction_data.branch_agent = dat_entity_link.branch_agent_code
  WHERE file_id = 29 AND 
		dat_entity_link.branch_agent_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S15:Invalid branch agent code*}')			
;	
END