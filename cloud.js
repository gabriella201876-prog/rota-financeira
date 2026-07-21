const Cloud=(()=>{
  const URL='https://ulzuevjbkisemjvlreyv.supabase.co';
  const KEY='sb_publishable_W3kwKoCM6wrbGh32vEHeCw_JsNDOKnX';
  const SESSION_KEY='rotaFinanceira_session';
  let session=JSON.parse(localStorage.getItem(SESSION_KEY)||'null');
  const headers=(auth=true)=>{const h={apikey:KEY,'Content-Type':'application/json'};if(auth&&session?.access_token)h.Authorization=`Bearer ${session.access_token}`;return h};
  async function parse(res){let data=null;try{data=await res.json()}catch(e){}if(!res.ok)throw new Error(data?.msg||data?.message||data?.error_description||data?.hint||'Não foi possível concluir.');return data}
  function store(s){session=s;if(s)localStorage.setItem(SESSION_KEY,JSON.stringify(s));else localStorage.removeItem(SESSION_KEY)}
  async function refresh(){if(!session?.refresh_token)return false;try{let r=await fetch(`${URL}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:headers(false),body:JSON.stringify({refresh_token:session.refresh_token})});store(await parse(r));return true}catch(e){store(null);return false}}
  async function api(path,opts={},retry=true){let r=await fetch(URL+path,{...opts,headers:{...headers(true),Prefer:'return=representation',...(opts.headers||{})}});if(r.status===401&&retry&&await refresh())return api(path,opts,false);return parse(r)}
  async function signUp(name,email,password){let r=await fetch(`${URL}/auth/v1/signup`,{method:'POST',headers:headers(false),body:JSON.stringify({email,password,data:{full_name:name}})});let d=await parse(r);if(d.access_token)store(d);return d}
  async function signIn(email,password){let r=await fetch(`${URL}/auth/v1/token?grant_type=password`,{method:'POST',headers:headers(false),body:JSON.stringify({email,password})});let d=await parse(r);store(d);return d}
  async function recover(email){let r=await fetch(`${URL}/auth/v1/recover`,{method:'POST',headers:headers(false),body:JSON.stringify({email})});return parse(r)}
  async function logout(){try{if(session)await fetch(`${URL}/auth/v1/logout`,{method:'POST',headers:headers(true)})}finally{store(null)}}
  async function user(){if(!session)return null;let r=await fetch(`${URL}/auth/v1/user`,{headers:headers(true)});if(r.status===401&&await refresh())return user();if(!r.ok){store(null);return null}return r.json()}
  async function loadData(){let [tx,sc,g,sub,profile]=await Promise.all([api('/rest/v1/transactions?select=*&order=transaction_date.desc'),api('/rest/v1/schedules?select=*&order=due_date.asc'),api('/rest/v1/weekly_goals?select=*'),api('/rest/v1/subscriptions?select=*'),api('/rest/v1/profiles?select=*')]);return{transactions:tx.map(x=>({id:x.id,type:x.type,amount:+x.amount,description:x.description,category:x.category,date:x.transaction_date,platform:x.platform})),schedules:sc.map(x=>({id:x.id,type:x.type,amount:+x.amount,description:x.description,date:x.due_date,completed:x.completed})),weeklyGoal:g[0]?+g[0].amount:1500,subscription:sub[0]||null,profile:profile[0]||null}}
  function insertTransaction(t){return api('/rest/v1/transactions',{method:'POST',body:JSON.stringify({type:t.type,amount:t.amount,description:t.description,category:t.category,transaction_date:t.date,platform:t.platform})})}
  function deleteTransaction(id){return api(`/rest/v1/transactions?id=eq.${encodeURIComponent(id)}`,{method:'DELETE'})}
  function insertSchedule(s){return api('/rest/v1/schedules',{method:'POST',body:JSON.stringify({type:s.type,amount:s.amount,description:s.description,due_date:s.date})})}
  function deleteSchedule(id){return api(`/rest/v1/schedules?id=eq.${encodeURIComponent(id)}`,{method:'DELETE'})}
  function updateGoal(amount){return api('/rest/v1/weekly_goals?on_conflict=user_id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify({amount})})}
  function active(){return !!session}
  return{signUp,signIn,recover,logout,user,loadData,insertTransaction,deleteTransaction,insertSchedule,deleteSchedule,updateGoal,active};
})();
