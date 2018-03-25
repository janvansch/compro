CREATE DEFINER=`root`@`localhost` PROCEDURE `data_validation`(IN fileId INT(25), procId bigint(64))
BEGIN
-- Start processing ERROR rules - note error rules must be processed first
-- S01-2 validate insurance company code - product provider
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id,  seq_id, proc_type, trx_proc_state, user_id, message)
	SELECT file_id, trx_id, procId, 0, 'L', 'E', 'admin01', '{S01-E: Invalid insurance company code}'
	FROM dat_transaction_data LEFT JOIN dat_prod_provider 
		ON dat_transaction_data.insurance_co_code = dat_prod_provider.ins_co_code
	WHERE file_id = fileId AND 
		 (dat_prod_provider.ins_co_code IS NULL
         OR dat_transaction_data.insurance_co_code IS NULL) 
	ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S01-E: Invalid insurance company code*}')
;
-- S03-3 validate source code - agent profile
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, procId, 0, 'L', 'E', 'admin01', '{SO3-E: Invalid adviser code}'
  FROM dat_transaction_data LEFT JOIN dat_agent_profile
	ON dat_transaction_data.source_code = dat_agent_profile.adviser_code
  WHERE file_id = fileId AND 
		dat_agent_profile.adviser_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{SO3-E: Invalid adviser code*}')
;
-- S04-1 validate policy number provided
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id,  seq_id, proc_type, trx_proc_state, user_id, message)
	SELECT file_id, trx_id, procId, 0, 'L', 'E', 'admin01', '{S04-E: Policy number requied}'
	FROM dat_transaction_data
	WHERE file_id = fileId AND 
		 dat_transaction_data.policy_no IS NULL
	ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S04-E: Policy number required*}')
;
-- S14-2
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, procId, 0, 'L', 'E', 'admin01', '{S14-E: Invalid line of business}'
  FROM dat_transaction_data LEFT JOIN dat_line_of_business
	ON dat_transaction_data.line_of_business = LOB_Code
  WHERE file_id = fileId AND 
		dat_line_of_business.LOB_Code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S14-E: Invalid line of business*}')
;
-- S15-3 validate branch agent - entity link
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, procId, 0, 'L', 'E', 'admin01', '{S15-E: Invalid branch agent code}'
  FROM dat_transaction_data LEFT JOIN dat_entity_link
	ON dat_transaction_data.branch_agent = dat_entity_link.branch_agent_code
  WHERE file_id = fileId AND 
		dat_entity_link.branch_agent_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S15-E: Invalid branch agent code*}')
;
-- S16-1 validate period not blank 
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id,  seq_id, proc_type, trx_proc_state, user_id, message)
	SELECT file_id, trx_id, procId, 0, 'L', 'E', 'admin01', '{S16-E: Period required}'  
	FROM dat_transaction_data
	WHERE file_id = fileId AND 
		 dat_transaction_data.period IS NULL
	ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S16-E: Period required*}')
;
-- S17-2 validate marketers code 2 - agent profile
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, procId, 0, 'L', 'E', 'admin01', '{S17-E: Invalid marketers code 2}'
  FROM dat_transaction_data LEFT JOIN dat_agent_profile
	ON dat_transaction_data.marketers_code_2 = dat_agent_profile.adviser_code
  WHERE file_id = fileId
	AND dat_transaction_data.marketers_code_2 IS NOT NULL
    AND dat_transaction_data.marketers_code_2 != '0'
    AND dat_transaction_data.marketers_code_2 != '00000000'
	AND dat_agent_profile.adviser_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S17-E: Invalid marketers code 2*}')
;
-- S18-2 validate marketers code 3 - agent profile
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, procId, 0, 'L', 'E', 'admin01', '{S18-E: Invalid marketers code 3}'
  FROM dat_transaction_data LEFT JOIN dat_agent_profile
	ON dat_transaction_data.marketers_code_3 = dat_agent_profile.adviser_code
  WHERE file_id = fileId
	AND dat_transaction_data.marketers_code_3 IS NOT NULL
    AND dat_transaction_data.marketers_code_3 != '0'
    AND dat_transaction_data.marketers_code_3 != '00000000'
	AND dat_agent_profile.adviser_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S18-E: Invalid marketers code 3*}')
;
-- S19-2 validate marketers code 4 - agent profile
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT file_id, trx_id, procId, 0, 'L', 'E', 'admin01', '{S19-E: Invalid marketers code 4}'
  FROM dat_transaction_data LEFT JOIN dat_agent_profile
	ON dat_transaction_data.marketers_code_4 = dat_agent_profile.adviser_code
  WHERE file_id = fileId
	AND dat_transaction_data.marketers_code_4 IS NOT NULL
    AND dat_transaction_data.marketers_code_4 != '0'
    AND dat_transaction_data.marketers_code_4 != '00000000'
	AND dat_agent_profile.adviser_code IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S19-E: Invalid marketers code 4*}')
;
-- Start processing WARNING rules - note warning rules must be processed second
-- S17-3 validate marketers code 2 - history
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT currtrx.file_id, currtrx.trx_id, procId, 0, 'L', 'W', 'admin01', '{S17-W: Marketers code 2 history mismatch}'
  FROM dat_transaction_data AS currtrx LEFT JOIN dat_transaction_data AS history
	ON currtrx.policy_no = history.policy_no 
		AND CAST(currtrx.period AS UNSIGNED INTEGER) = CAST(history.period AS UNSIGNED INTEGER) + 1
  WHERE currtrx.period IS NOT NULL
	AND currtrx.file_id = fileId
	AND history.marketers_code_2 IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S17-W: Marketers code 2 history mismatch*}')
;
-- S18-3 validate marketers code 3 - history
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT currtrx.file_id, currtrx.trx_id, procId, 0, 'L', 'W', 'admin01', '{S18-W: Marketers code 3 history mismatch}'
  FROM dat_transaction_data AS currtrx LEFT JOIN dat_transaction_data AS history
	ON currtrx.policy_no = history.policy_no 
		AND CAST(currtrx.period AS UNSIGNED INTEGER) = CAST(history.period AS UNSIGNED INTEGER) + 1
  WHERE currtrx.period IS NOT NULL
	AND currtrx.file_id = fileId
	AND history.marketers_code_3 IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S18-W: Marketers code 3 history mismatch*}')
;
-- S19-3 validate marketers code 4 - history
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, message)
  SELECT currtrx.file_id, currtrx.trx_id, procId, 0, 'L', 'W', 'admin01', '{S19-W: Marketers code 4 history mismatch}'
  FROM dat_transaction_data AS currtrx LEFT JOIN dat_transaction_data AS history
	ON currtrx.policy_no = history.policy_no 
		AND CAST(currtrx.period AS UNSIGNED INTEGER) = CAST(history.period AS UNSIGNED INTEGER) + 1
  WHERE currtrx.period IS NOT NULL
	AND currtrx.file_id = fileId
	AND history.marketers_code_4 IS NULL
  ON DUPLICATE KEY UPDATE adt_trx_proc_state.message=concat(message, ',', '{S19-W: Marketers code 4 history mismatch*}')
;
-- Start processing data transformation rules
-- S02-1 Marketers Code
UPDATE dat_transaction_data
SET marketers_code='11111111'
WHERE marketers_code IS NULL
	AND file_id = fileId
    AND trx_type = 'F'
;
-- S05-1 Surname
UPDATE dat_transaction_data
SET policy_holder='XXX'
WHERE policy_holder IS NULL
	AND file_id = fileId
    AND trx_type = 'F'
;
-- S06-1 Initials
UPDATE dat_transaction_data
SET initials='XXX'
WHERE initials IS NULL
	AND file_id = fileId
    AND trx_type = 'F'
;
-- S12-1 Revised Policy Number
UPDATE dat_transaction_data
SET revised_policy_no = policy_no
WHERE revised_policy_no IS NULL
	AND file_id = fileId
    AND trx_type = 'F'
;
-- Create valid process state records for the rest of the transactions
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id, seq_id, proc_type, trx_proc_state, user_id, adt_trx_proc_state.message)
  SELECT dat_transaction_data.file_id, dat_transaction_data.trx_id, procId, 0, 'L', 'V', 'admin01', ''
  FROM dat_transaction_data LEFT JOIN adt_trx_proc_state
	ON dat_transaction_data.trx_id = adt_trx_proc_state.trx_id
  WHERE dat_transaction_data.file_id = fileId
	AND adt_trx_proc_state.trx_id IS NULL
;
-- Update file register stats
UPDATE dat_comm_file_reg 
	SET 
		load_count = (SELECT COUNT(trx_proc_state) 
						FROM adt_trx_proc_state 
                        WHERE adt_trx_proc_state.file_id = fileId 
                        AND adt_trx_proc_state.proc_id = procId),
        warning_count = (SELECT COUNT(trx_proc_state) 
							FROM adt_trx_proc_state 
                            WHERE adt_trx_proc_state.file_id = fileId 
                            AND adt_trx_proc_state.proc_id = procId 
                            AND adt_trx_proc_state.trx_proc_state = 'W'),
		error_count = (SELECT COUNT(trx_proc_state) 
							FROM adt_trx_proc_state 
                            WHERE adt_trx_proc_state.file_id = fileId 
                            AND adt_trx_proc_state.proc_id = procId 
                            AND adt_trx_proc_state.trx_proc_state = 'E'),
		valid_count = (SELECT COUNT(trx_proc_state) 
							FROM adt_trx_proc_state 
                            WHERE adt_trx_proc_state.file_id = fileId
                            AND adt_trx_proc_state.proc_id = procId
                            AND adt_trx_proc_state.trx_proc_state = 'V')
WHERE dat_comm_file_reg.file_id = fileId
;
END