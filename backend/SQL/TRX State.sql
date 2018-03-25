SELECT dat_transaction_data.trx_id, dat_transaction_data.file_id, message
FROM dat_transaction_data JOIN adt_trx_proc_state
ON dat_transaction_data.file_id = adt_trx_proc_state.file_id
WHERE dat_transaction_data.file_id = 6 AND adt_trx_proc_state.trx_proc_state = 'E'
;
