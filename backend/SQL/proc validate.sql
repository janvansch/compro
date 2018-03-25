CREATE PROCEDURE `new_procedure` ()
BEGIN
INSERT INTO adt_trx_proc_state(file_id, trx_id, proc_id,  proc_type, trx_proc_state, user_id) 
  SELECT file_id, trx_id, '1100', 'L', 'E', 'admin01'  
  FROM dat_transaction_data 
  WHERE file_id = 29 AND insurance_co_code IS NULL;
END
