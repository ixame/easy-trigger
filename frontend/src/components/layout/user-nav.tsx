import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Button} from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'


import ConfirmDialog from "@/components/custom/confirm-dialog";
import {Copy} from "lucide-react";

export function UserNav() {

  // 通过zustand获取userinfo信息

  // 获取userInfo中的info信息




  const handleLogout = () => {
    // updateState(draft => {
    //   draft.isLoading = true;
    // })
    // Logout().then(() => {
    //   useUserInfoStore.setState({userInfo: null})
    //   window.location.href = `/login?redirect=${window.location.pathname}`
    // }).finally(() => updateState(draft => {
    //   draft.isLoading = false
    // }))
  }
  // const handleDialog = () => updateState(draft => {
  //   draft.isOpen = !draft.isOpen
  //   draft.isLoading = false
  // })

  return (
    <>
      {/* <ConfirmDialog open={state.isOpen} description={'你确定要退出登录吗？'} submitTitle={'退出登录'}
                     loading={state.isLoading} onCancel={handleDialog} onSubmit={handleLogout}/> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='relative h-8 w-8 rounded-full'>
            <Avatar className='h-8 w-8'>
              <AvatarImage src='/avatars/01.png' alt='@shadcn'/>
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56' align='end' forceMount>
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              {/* <p className='text-sm font-medium leading-none'>{info?.account || '未知'}</p> */}
              <p className='text-xs leading-none text-muted-foreground flex items-center'>
                {/* <span>uuid: {info?.uuid || '-'}</span> */}
                {/* <Copy size={12} className='ml-1 cursor-pointer' onClick={handleCopy}/> */}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              个人中心
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              订单管理
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              设置中心
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator/>
          {/* <DropdownMenuItem onClick={handleDialog}>
            退出登录
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem> */}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
