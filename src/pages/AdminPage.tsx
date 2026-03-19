'use client'

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, Edit2, Search, X, Check, Loader2, ExternalLink, RefreshCw } from 'lucide-react'
import { getMembersFromDB, addMemberToDB, updateMemberInDB, deleteMemberFromDB } from '../lib/cloudbase'

interface Member {
  _id: string
  userId: string
  memberLevel: string
  expireTime?: string
  createdAt?: string
}

export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | null>(null)
  const [searchKeyword, setSearchKeyword] = useState('')
  
  // 表单状态
  const [formData, setFormData] = useState({
    userId: '',
    memberLevel: 'yearly',
    expireTime: '',
  })
  const [submitting, setSubmitting] = useState(false)

  // 从数据库加载
  const loadMembers = async () => {
    setLoading(true)
    const data = await getMembersFromDB()
    setMembers(data)
    setLoading(false)
  }

  // 刷新数据
  const handleRefresh = async () => {
    setRefreshing(true)
    await loadMembers()
    setRefreshing(false)
  }

  useEffect(() => {
    loadMembers()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      if (editingMember) {
        // 编辑
        await updateMemberInDB(editingMember._id, {
          userId: formData.userId,
          memberLevel: formData.memberLevel,
          expireTime: formData.expireTime ? formData.expireTime + 'T00:00:00.000Z' : undefined,
        })
        alert('修改成功')
      } else {
        // 添加
        await addMemberToDB({
          userId: formData.userId,
          memberLevel: formData.memberLevel,
          expireTime: formData.expireTime ? formData.expireTime + 'T00:00:00.000Z' : undefined,
        })
        alert('添加成功')
      }
      
      setShowAddModal(false)
      setEditingMember(null)
      setFormData({ userId: '', memberLevel: 'yearly', expireTime: '' })
      await loadMembers()
    } catch (error) {
      console.error('操作失败:', error)
      alert('操作失败，请重试')
    }
    
    setSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个会员吗？')) return
    
    try {
      await deleteMemberFromDB(id)
      alert('删除成功')
      await loadMembers()
    } catch (error) {
      console.error('删除失败:', error)
      alert('删除失败，请重试')
    }
  }

  const openEditModal = (member: Member) => {
    setEditingMember(member)
    setFormData({
      userId: member.userId,
      memberLevel: member.memberLevel,
      expireTime: member.expireTime ? member.expireTime.split('T')[0] : '',
    })
    setShowAddModal(true)
  }

  const filteredMembers = members.filter(m => 
    m.userId.toLowerCase().includes(searchKeyword.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-gray-100 rounded-xl transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">会员管理</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 提示信息 */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="text-amber-800 text-sm mb-2">
                当前为本地演示模式（数据存储在浏览器）。
              </p>
              <p className="text-amber-600 text-xs mb-2">
                如需操作真实数据库，请直接告诉我："添加会员 user_xxx" 或 "删除会员 user_xxx"
              </p>
              <a 
                href="https://tcb.cloud.tencent.com/dev?envId=ai-fortune-8g6l03mn90defc56#/db/doc/collection/members"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-800 text-xs"
              >
                打开数据库控制台
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1 text-amber-600 hover:text-amber-800 text-sm whitespace-nowrap disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              刷新
            </button>
          </div>
        </div>

        {/* 搜索和添加 */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索用户ID..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400"
            />
          </div>
          <button
            onClick={() => {
              setEditingMember(null)
              setFormData({ userId: '', memberLevel: 'yearly', expireTime: '' })
              setShowAddModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-violet-500 text-white rounded-xl hover:bg-violet-600 transition"
          >
            <Plus className="w-5 h-5" />
            添加会员
          </button>
        </div>

        {/* 会员列表 */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 mx-auto text-violet-500 animate-spin" />
            <p className="text-gray-500 mt-2">加载中...</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl">
            <p className="text-gray-500">暂无会员数据</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">用户ID</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">会员等级</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">过期时间</th>
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member._id} className="border-t border-gray-100">
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-gray-800">{member.userId}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        member.memberLevel === 'lifetime' ? 'bg-purple-100 text-purple-700' :
                        member.memberLevel === 'yearly' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {member.memberLevel === 'lifetime' ? '终身会员' :
                         member.memberLevel === 'yearly' ? '年度会员' : '月度会员'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {member.expireTime ? new Date(member.expireTime).toLocaleDateString('zh-CN') : '永久'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(member)}
                          className="p-2 text-gray-400 hover:text-violet-500 hover:bg-violet-50 rounded-lg transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="text-center text-gray-400 text-sm mt-4">
          共 {filteredMembers.length} 条记录
        </p>
      </main>

      {/* 添加/编辑弹窗 */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editingMember ? '编辑会员' : '添加会员'}</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户ID</label>
                  <input
                    type="text"
                    required
                    value={formData.userId}
                    onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                    placeholder="输入用户ID"
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">会员等级</label>
                  <select
                    value={formData.memberLevel}
                    onChange={(e) => setFormData({ ...formData, memberLevel: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400"
                  >
                    <option value="monthly">月度会员</option>
                    <option value="yearly">年度会员</option>
                    <option value="lifetime">终身会员</option>
                  </select>
                </div>
                
                {formData.memberLevel !== 'lifetime' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">过期时间</label>
                    <input
                      type="date"
                      value={formData.expireTime}
                      onChange={(e) => setFormData({ ...formData, expireTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:border-violet-400"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-violet-500 text-white rounded-xl hover:bg-violet-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingMember ? '保存' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
