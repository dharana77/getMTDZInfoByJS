export async function getServerSideProps(context) {
  const CaverExtKAS = require('caver-js-ext-kas');
  const contractAddress = "0x46dbdc7965cf3cd2257c054feab941a05ff46488";
  const accessKeyId = "KASKFIEI9JGNLQRGDCXAMPXI";
  const secretAccessKey = "4VCk3okaALncT8f9WXxBzR7bASaxLY05sV2x_Bd8";
  const chainID = 8217;
  const caver = new CaverExtKAS(chainID, accessKeyId, secretAccessKey);
  
  let holderList = [];
  
  function test2(cur){
    let query = { size: 120}
    if (cur){
      query = {size:120, cursor:cur}
    }
    const ret = caver.kas.tokenHistory.getNFTList("0x46dbdc7965cf3cd2257c054feab941a05ff46488", query);
    return ret;
  }

  let t = test2();
  let t2 = await Promise.resolve(t);
  let cursor = t2.cursor;

  let json_link_per_holder = {};

  async function save_img_url(url, target){
    await fetch(url)
      .then(res => {res.json()})
      .then((out) => {
        console.log(out);
          console.log("image", out);
          let img_link = out["image"];
          console.log("img_link", img_link);
          if (target in json_link_per_holder){
            json_link_per_holder[target].push(img_link);
          }else{
            json_link_per_holder[target] = [];
            json_link_per_holder[target].push(img_link);
          }
      }).catch(err => console.error(err));
  }
  
  while(cursor){
    //owenr add
    for(let i=0; i<t2.items.length; i++){
      holderList.push(t2.items[i].owner);
    }
    //json_link per owner add
    for(let i=0; i<t2.items.length; i++){
      let target = t2.items[i].owner;
      let link = t2.items[i].tokenUri;
      //just save token url
      if (target in json_link_per_holder){
        json_link_per_holder[target].push(link);
      }else{
        json_link_per_holder[target] = [];
        json_link_per_holder[target].push(link);
      }
      //get image link and save
      
      // await save_img_url(link, target);  
    }

    t = test2(cursor);
    t2 = await Promise.resolve(t);
    cursor = t2.cursor;
  }

  let img_link_per_holder = {};

  for(let i=0; i<Object.keys(json_link_per_holder).length; i++){
    let key = Object.keys(json_link_per_holder)[i];
    let value = json_link_per_holder[key];
    for(let j=0; j<value.length; j++){
      let obj = await (await fetch(value[j])).json();
      let name = obj["name"];

      if (key in img_link_per_holder){
        img_link_per_holder[key].push(name);
      }else{
        img_link_per_holder[key] = [];
        img_link_per_holder[key].push(name);
      }
    }
  }

  let d = {}
  for(let j=0; j<holderList.length; j++){
    if(holderList[j] in d){
      d[holderList[j]]+=1;
    }else{
      d[holderList[j]] = 1;
    }
  }
 
  var sorted_holderList = [];
  for (var name in d) {
    sorted_holderList.push([name, d[name], img_link_per_holder[name]]);
  }

  sorted_holderList.sort(function(a, b) {
    return a[1] - b[1];
  });

  sorted_holderList = sorted_holderList.reverse();

  return {
    props: {sorted_holderList} // will be passed to the page component as props
  }
}

export default function Home(sorted_holderList) {

  const holders = sorted_holderList.sorted_holderList;

  return (
    <div>
      <h1>MTDZ NFT Holders on Klaytn Mainnet</h1>
          <p>Total number of holders: <span id="holderCount"></span></p>
      <table>
        <thead>
          <tr>
            {holders[0].map((item, index) => {
              return <th>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {holders.slice(1, holders.length).map((item, index) => {
            return (
              <tr>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}