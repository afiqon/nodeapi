SELECT a.usr_id,a.tobtab_no_lesen,a.tobtab_tkh_lesen_tamat,b.appl_company_name,b.appl_company_address,b.appl_company_phone,c.tobtab_application_status_name,d.tobtab_type_name
FROM tbl_tobtab a
INNER JOIN tbl_tobtab_application b ON a.usr_id=b.usr_id
INNER JOIN tbl_tobtab_application_status c ON b.appl_status_id=c.tobtab_application_status_id
INNER JOIN sys_tobtab_type d ON b.tobtab_type_id=d.tobtab_type_id
WHERE a.usr_id='68568-A'