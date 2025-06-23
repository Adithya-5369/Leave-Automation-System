export const isApprover = (role: string | undefined) =>
    ['hod', 'dean', 'registrar', 'director'].includes(role || '');
  
export const isAdhoc = (role: string | undefined) => role === 'adhoc';
  
export const isFaculty = (role: string | undefined) =>
    ['faculty', 'deans', 'adhoc'].includes(role || '');