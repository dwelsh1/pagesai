import Editor from '@/src/components/editor'; 
export default async function PageView({params}:{params:{id:string}}){
  const { id } = await params;
  return <Editor pageId={id}/> 
}
