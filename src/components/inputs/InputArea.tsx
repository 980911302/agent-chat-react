import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  ArrowUp,
  Plus,
  X,
  XCircle,
  FileText,
  User,
  Users,
  BookOpen,
  MoreHorizontal,
} from 'lucide-react';
import { Upload, message } from 'antd';
import type { ExtraAgentData, KnowledgeGroup, DocumentInfo, HorizontalAlignment, Theme } from '../../types';
import { TokensBar } from '../common/TokensBar';
import { getToken } from '../../config';
import { agentsApi, agentGroupsApi, knowledgeApi, uploadApi } from '../../vendor/api-gateway/index';

/**
 * 消息输入区域组件
 * 支持 @ 智能体选择、# 知识库引用、文件上传
 * HTML 结构和 class 命名完全对齐 Vue 版 InputArea.vue
 */

export interface InputAreaProps {
  /** WebSocket 是否已连接 */
  isConnected: boolean;
  /** 是否正在等待 AI 回复 */
  isLoading: boolean;
  /** 连接错误信息 */
  connectionError?: string | null;
  /** 主题 */
  theme?: Theme;
  /** 是否显示智能体信息 */
  showAgentInfo?: boolean;
  /** 是否启用文件上传 */
  isEnableFile?: boolean;
  /** 是否启用知识库选择 */
  input_isEnableKnowledge?: boolean;
  /** 自定义占位符 */
  placeholder?: string;
  /** 是否显示 Token 进度条 */
  showTokensBar?: boolean;
  /** 当前智能体名称（用于 TokensBar） */
  currentAgentName?: string;
  /** 各智能体的 token 数量 */
  agentTokens?: Record<string, number>;
  /** 输入容器水平对齐 */
  horizontalAlignment?: HorizontalAlignment;
  /** 输入区域边距 */
  margin?: string;
  /** 输入框宽度 */
  inputWidth?: string;
  /** 外部传入的智能体数据（跳过 API 请求） */
  inputAgentsData?: ExtraAgentData[];
  /** 用户绑定的默认智能体名称 */
  boundAgent?: string | null;
  /** 用户绑定的默认智能体类型 */
  boundAgentType?: 'agent' | 'group';
  /** 发送消息事件 */
  onSend?: (
    message: string,
    documents: DocumentInfo[],
    mention?: { type: 'agent' | 'group'; name: string },
    knowledgeIds?: string[]
  ) => void;
  /** 终止事件 */
  onTerminate?: () => void;
}

/** 智能体选项（内部使用） */
interface AgentOption {
  name: string;
  type: 'agent' | 'group';
  description?: string;
}

/** 已上传文件信息 */
interface UploadedFile {
  name: string;
  size: number;
  file: File;
}

// 最大文件大小：10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const InputArea: React.FC<InputAreaProps> = ({
  isConnected,
  isLoading,
  connectionError = null,
  theme = 'dark',
  showAgentInfo = false,
  isEnableFile = true,
  input_isEnableKnowledge = true,
  placeholder: customPlaceholder = '',
  showTokensBar = false,
  currentAgentName = '',
  agentTokens = {},
  horizontalAlignment = 'Full',
  margin = '',
  inputWidth = '',
  inputAgentsData = [],
  boundAgent = null,
  boundAgentType = 'agent',
  onSend,
  onTerminate,
}) => {
  // ==================== 状态管理 ====================
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  // 智能体列表（Mention 选项）
  const [mentionItems, setMentionItems] = useState<AgentOption[]>([]);
  const [showMentionPanel, setShowMentionPanel] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionStartIndex, setMentionStartIndex] = useState(-1);
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [selectedMention, setSelectedMention] = useState<{ type: 'agent' | 'group'; name: string } | null>(null);

  // 知识库相关状态
  const [knowledgeGroups, setKnowledgeGroups] = useState<KnowledgeGroup[]>([]);
  const [selectedKnowledgeIds, setSelectedKnowledgeIds] = useState<string[]>([]);
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
  const [knowledgeQuery, setKnowledgeQuery] = useState('');
  const [knowledgeStartIndex, setKnowledgeStartIndex] = useState(-1);
  const [selectedKnowledgeIndex, setSelectedKnowledgeIndex] = useState(0);

  // 动态工具栏（折叠/展开）
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMorePanel, setShowMorePanel] = useState(false);

  // 数据加载标记
  const agentsFetchedRef = useRef(false);
  const knowledgeFetchedRef = useRef(false);

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mentionPanelRef = useRef<HTMLDivElement>(null);
  const toolbarAgentRef = useRef<HTMLDivElement>(null);
  const toolbarKnowledgeRef = useRef<HTMLDivElement>(null);
  const toolbarMoreRef = useRef<HTMLDivElement>(null);
  const knowledgePanelRef = useRef<HTMLDivElement>(null);

  // ==================== 计算属性 ====================

  /** 是否为单智能体模式 */
  const isSingleAgent = useMemo(() => mentionItems.length === 1, [mentionItems]);

  /** 过滤后的智能体列表 */
  const filteredItems = useMemo(() => {
    const query = mentionQuery.toLowerCase();
    return mentionItems
      .filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.description && item.description.toLowerCase().includes(query))
      );
  }, [mentionItems, mentionQuery]);

  /** 过滤后的知识库列表 */
  const filteredKnowledgeGroups = useMemo(() => {
    const query = knowledgeQuery.toLowerCase();
    return knowledgeGroups.filter(
      (g) =>
        g.group_name.toLowerCase().includes(query) ||
        (g.description && g.description.toLowerCase().includes(query))
    );
  }, [knowledgeGroups, knowledgeQuery]);

  /** 能量条显示的智能体名称 */
  const tokensBarAgentName = useMemo(() => {
    if (selectedMention) return selectedMention.name;
    if (isSingleAgent && mentionItems.length > 0) return mentionItems[0].name;
    if (currentAgentName) return currentAgentName;
    return boundAgent || '';
  }, [selectedMention, isSingleAgent, mentionItems, currentAgentName, boundAgent]);

  /** 能量条显示的 token 数量 */
  const tokensBarValue = useMemo(() => {
    return tokensBarAgentName ? (agentTokens[tokensBarAgentName] ?? 0) : 0;
  }, [tokensBarAgentName, agentTokens]);

  /** 完整的占位符文本 */
  const inputPlaceholder = useMemo(() => {
    if (customPlaceholder) return customPlaceholder;
    if (isConnected) {
      if (boundAgent) {
        const typeLabel = boundAgentType === 'group' ? '智能体组' : '智能体';
        return `输入消息... (默认发送给${typeLabel}: ${boundAgent})`;
      }
      return '输入消息... (请使用 @ 指定智能体)';
    }
    return '未连接';
  }, [customPlaceholder, isConnected, boundAgent, boundAgentType]);

  /** 输入框容器的布局样式（根据 horizontalAlignment / margin / inputWidth 计算） */
  const containerStyle = useMemo((): React.CSSProperties => {
    const parts = margin.trim().split(/\s+/);
    const marginLeft = parts[0] || '';
    const marginRight = parts[1] || parts[0] || '';
    const width = inputWidth;

    switch (horizontalAlignment) {
      case 'Left':
        return {
          alignSelf: 'flex-start',
          ...(marginLeft ? { marginLeft } : {}),
          ...(width ? { width } : {}),
        };
      case 'Center':
        return {
          alignSelf: 'center',
          ...(width ? { width } : {}),
        };
      case 'Right':
        return {
          alignSelf: 'flex-end',
          ...(marginRight ? { marginRight } : {}),
          ...(width ? { width } : {}),
        };
      case 'Full':
      default:
        return {
          ...(marginLeft ? { marginLeft } : {}),
          ...(marginRight ? { marginRight } : {}),
        };
    }
  }, [horizontalAlignment, margin, inputWidth]);

  // ==================== 数据加载 ====================

  /** 从后端加载智能体和智能体组列表 */
  const fetchAgents = useCallback(async () => {
    if (!getToken()) return;
    if (agentsFetchedRef.current) return;
    agentsFetchedRef.current = true;

    try {
      const [agentsRes, groupsRes] = await Promise.all([
        agentsApi.getAll().catch(() => ({ data: [] })),
        agentGroupsApi.getAll().catch(() => ({ data: [] })),
      ]);

      const agents = (agentsRes.data || []).map((a: any) => ({
        name: a.name,
        type: 'agent' as const,
        description: a.describe || a.description,
      }));

      const groups = (groupsRes.data || []).map((g: any) => ({
        name: g.name,
        type: 'group' as const,
        description: g.describe,
      }));

      setMentionItems([...agents, ...groups]);
    } catch (error) {
      console.error('[InputArea] 加载智能体列表失败:', error);
    }
  }, []);

  /** 从后端加载知识库组列表 */
  const fetchKnowledgeGroups = useCallback(async () => {
    if (!input_isEnableKnowledge) return;
    if (!getToken()) return;
    if (knowledgeFetchedRef.current) return;
    knowledgeFetchedRef.current = true;

    try {
      const res: any = await knowledgeApi.listGroups().catch(() => ({ data: { groups: [] } }));
      const groups = res.data?.groups || res.groups || [];
      setKnowledgeGroups(groups);
    } catch (error) {
      console.error('[InputArea] 加载知识库列表失败:', error);
    }
  }, [input_isEnableKnowledge]);

  // 初始化：加载外部数据或从后端获取
  useEffect(() => {
    if (inputAgentsData.length > 0) {
      setMentionItems(
        inputAgentsData.map((a) => ({
          name: a.agent,
          type: a.agentType,
          description: a.describe,
        }))
      );
      agentsFetchedRef.current = true;
    } else {
      fetchAgents();
    }
  }, [inputAgentsData, fetchAgents]);

  // 加载知识库
  useEffect(() => {
    if (input_isEnableKnowledge) {
      fetchKnowledgeGroups();
    }
  }, [input_isEnableKnowledge, fetchKnowledgeGroups]);

  // ==================== 工具栏折叠检测 ====================

  /** 检测工具栏是否需要折叠 */
  const checkToolbarWidth = useCallback((container: HTMLElement) => {
    if (!toolbarRef.current) return;

    const containerWidth = container.clientWidth;
    const toolbarChildren = toolbarRef.current.children;

    // 计算所有子元素的总宽度
    let totalWidth = 0;
    for (let i = 0; i < toolbarChildren.length; i++) {
      const child = toolbarChildren[i] as HTMLElement;
      totalWidth += child.offsetWidth;
    }

    // 如果总宽度超过容器宽度的 80%，则折叠
    const threshold = containerWidth * 0.8;
    const needCollapse = totalWidth > threshold;

    setIsCollapsed((prev) => {
      if (prev !== needCollapse) {
        setShowMorePanel(false);
      }
      return needCollapse;
    });
  }, []);

  // 初始化 ResizeObserver 监测容器宽度变化
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        checkToolbarWidth(entry.target as HTMLElement);
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [checkToolbarWidth]);

  // ==================== 点击外部关闭面板 ====================

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // 检查是否在 mention 面板或工具栏智能体选择器内
      const isInMentionArea =
        (mentionPanelRef.current && mentionPanelRef.current.contains(target)) ||
        (toolbarAgentRef.current && toolbarAgentRef.current.contains(target));
      if (!isInMentionArea && textareaRef.current !== target) {
        setShowMentionPanel(false);
      }

      // 检查是否在知识库面板或工具栏知识库选择器内
      const isInKnowledgeArea =
        (knowledgePanelRef.current && knowledgePanelRef.current.contains(target)) ||
        (toolbarKnowledgeRef.current && toolbarKnowledgeRef.current.contains(target));
      if (!isInKnowledgeArea && textareaRef.current !== target) {
        setShowKnowledgePanel(false);
      }

      // 检查是否在更多面板内
      const isInMoreArea =
        toolbarMoreRef.current && toolbarMoreRef.current.contains(target);
      if (!isInMoreArea && textareaRef.current !== target) {
        setShowMorePanel(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ==================== 输入处理 ====================

  /** 处理输入变化，检测 @ 和 # 触发 */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      const cursorPos = e.target.selectionStart || 0;
      setInputMessage(value);

      const textBeforeCursor = value.slice(0, cursorPos);

      // 检测 # 触发知识库选择
      if (input_isEnableKnowledge) {
        const lastHashIndex = textBeforeCursor.lastIndexOf('#');
        if (lastHashIndex !== -1) {
          const textAfterHash = textBeforeCursor.slice(lastHashIndex + 1);
          if (!textAfterHash.includes(' ') && !textAfterHash.includes('\n')) {
            setKnowledgeQuery(textAfterHash);
            setKnowledgeStartIndex(lastHashIndex);
            setShowKnowledgePanel(true);
            setSelectedKnowledgeIndex(0);
            setShowMentionPanel(false);
            return;
          }
        }
      }

      // 检测 @ 触发智能体选择（仅在多智能体模式下）
      if (!isSingleAgent) {
        const lastAtIndex = textBeforeCursor.lastIndexOf('@');
        if (lastAtIndex !== -1) {
          const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
          if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
            setMentionQuery(textAfterAt);
            setMentionStartIndex(lastAtIndex);
            setShowMentionPanel(true);
            setSelectedMentionIndex(0);
            setShowKnowledgePanel(false);
            return;
          }
        }
      }

      setShowMentionPanel(false);
      setMentionQuery('');
      setMentionStartIndex(-1);
      setShowKnowledgePanel(false);
      setKnowledgeQuery('');
      setKnowledgeStartIndex(-1);
    },
    [input_isEnableKnowledge, isSingleAgent]
  );

  // ==================== 选择操作 ====================

  /**
   * 选择 mention（智能体/组）
   * @param item 选择的智能体/组
   * @param fromToolbar 是否从工具栏点击（非 @ 触发）
   */
  const selectMention = useCallback(
    (item: { type: 'agent' | 'group'; name: string }, fromToolbar = false) => {
      // 从工具栏点击时，直接设置选择
      if (fromToolbar) {
        setSelectedMention({ type: item.type, name: item.name });
        setShowMentionPanel(false);
        setMentionQuery('');
        setMentionStartIndex(-1);
        textareaRef.current?.focus();
        return;
      }

      // 从 @ 触发的选择
      if (mentionStartIndex === -1) return;
      const before = inputMessage.slice(0, mentionStartIndex);
      const after = inputMessage.slice(mentionStartIndex + 1 + mentionQuery.length);

      setInputMessage(before + after);
      setSelectedMention({ type: item.type, name: item.name });
      setShowMentionPanel(false);
      setMentionQuery('');
      setMentionStartIndex(-1);

      // 设置光标位置
      requestAnimationFrame(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          const newCursorPos = before.length;
          textarea.setSelectionRange(newCursorPos, newCursorPos);
          textarea.focus();
        }
      });
    },
    [inputMessage, mentionStartIndex, mentionQuery]
  );

  /** 移除 mention */
  const removeMention = useCallback(() => {
    setSelectedMention(null);
  }, []);

  /** 切换智能体面板显示状态 */
  const toggleMentionPanel = useCallback(() => {
    setShowMentionPanel((prev) => {
      if (!prev) {
        // 打开面板时确保数据已加载
        fetchAgents();
      }
      return !prev;
    });
  }, [fetchAgents]);

  /** 切换知识库面板显示状态 */
  const toggleKnowledgePanel = useCallback(() => {
    setShowKnowledgePanel((prev) => {
      if (!prev) {
        fetchKnowledgeGroups();
      }
      return !prev;
    });
  }, [fetchKnowledgeGroups]);

  /** 切换更多工具面板显示状态 */
  const toggleMorePanel = useCallback(() => {
    setShowMorePanel((prev) => {
      if (!prev) {
        // 打开更多面板时关闭其他面板
        setShowMentionPanel(false);
        setShowKnowledgePanel(false);
      }
      return !prev;
    });
  }, []);

  /** 选择知识库 */
  const selectKnowledge = useCallback(
    (group: KnowledgeGroup) => {
      // 避免重复选择
      setSelectedKnowledgeIds((prev) => {
        if (prev.includes(group.group_id)) return prev;
        return [...prev, group.group_id];
      });

      // 移除输入中的 #query
      if (knowledgeStartIndex !== -1) {
        const before = inputMessage.slice(0, knowledgeStartIndex);
        const after = inputMessage.slice(knowledgeStartIndex + 1 + knowledgeQuery.length);
        setInputMessage(before + after);
      }
      setShowKnowledgePanel(false);
      setKnowledgeQuery('');
      setKnowledgeStartIndex(-1);

      requestAnimationFrame(() => {
        textareaRef.current?.focus();
      });
    },
    [inputMessage, knowledgeStartIndex, knowledgeQuery]
  );

  /** 移除已选知识库 */
  const removeKnowledge = useCallback((id: string) => {
    setSelectedKnowledgeIds((prev) => prev.filter((kid) => kid !== id));
  }, []);

  // ==================== 键盘事件 ====================

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // 知识库面板键盘导航
      if (showKnowledgePanel && filteredKnowledgeGroups.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedKnowledgeIndex((prev) => (prev + 1) % filteredKnowledgeGroups.length);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedKnowledgeIndex(
            (prev) => (prev - 1 + filteredKnowledgeGroups.length) % filteredKnowledgeGroups.length
          );
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          selectKnowledge(filteredKnowledgeGroups[selectedKnowledgeIndex]);
          return;
        }
        if (e.key === 'Escape') {
          setShowKnowledgePanel(false);
          return;
        }
      }

      // mention 面板键盘导航
      if (showMentionPanel && filteredItems.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedMentionIndex((prev) => (prev + 1) % filteredItems.length);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedMentionIndex(
            (prev) => (prev - 1 + filteredItems.length) % filteredItems.length
          );
          return;
        }
        if (e.key === 'Enter' || e.key === 'Tab') {
          e.preventDefault();
          selectMention(filteredItems[selectedMentionIndex]);
          return;
        }
        if (e.key === 'Escape') {
          setShowMentionPanel(false);
          return;
        }
      }

      // Enter 发送（Shift+Enter 换行）
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [
      showKnowledgePanel,
      filteredKnowledgeGroups,
      selectedKnowledgeIndex,
      selectKnowledge,
      showMentionPanel,
      filteredItems,
      selectedMentionIndex,
      selectMention,
    ]
  );

  // ==================== 文件处理 ====================

  /** 格式化文件大小 */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  /** 处理文件选择（antd Upload beforeUpload） */
  const handleFileUpload = useCallback((file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      message.error(`文件 ${file.name} 大小超过 10MB 限制`);
      return false;
    }

    setUploadedFiles((prev) => [
      ...prev,
      { name: file.name, size: file.size, file },
    ]);

    return false; // 阻止 antd 自动上传
  }, []);

  /** 移除文件 */
  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ==================== 发送/终止 ====================

  /** 发送消息 */
  const handleSend = useCallback(async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;
    if (!isConnected) return;

    // 确定目标智能体
    let targetMention: { type: 'agent' | 'group'; name: string } | undefined;
    if (selectedMention) {
      targetMention = { type: selectedMention.type, name: selectedMention.name };
    } else if (isSingleAgent && mentionItems.length > 0) {
      // 单智能体模式自动使用
      const singleAgent = mentionItems[0];
      targetMention = { type: singleAgent.type, name: singleAgent.name };
    } else if (boundAgent) {
      targetMention = { type: boundAgentType, name: boundAgent };
    }

    if (!targetMention) {
      message.warning('请使用 @ 指定目标智能体');
      return;
    }

    let documents: DocumentInfo[] = [];

    // 如果有文件，先上传
    if (uploadedFiles.length > 0) {
      setUploading(true);
      try {
        const res = await uploadApi.uploadFiles(uploadedFiles.map((item) => item.file));
        if (!res.success || !res.data) {
          message.error('文件上传失败: ' + (res.message || '操作失败'));
          setUploading(false);
          return;
        }
        const docs = res.data;
        documents = Array.isArray(docs) ? docs : [docs];
      } catch (error) {
        console.error('[InputArea] 文件上传失败:', error);
        message.error('文件上传失败，请重试');
        setUploading(false);
        return;
      } finally {
        setUploading(false);
      }
    }

    const knowledgeIds = selectedKnowledgeIds.length > 0 ? [...selectedKnowledgeIds] : undefined;

    onSend?.(inputMessage, documents, targetMention, knowledgeIds);

    // 清空输入框和文件列表，保留 mention
    setInputMessage('');
    setUploadedFiles([]);
  }, [
    inputMessage,
    uploadedFiles,
    isConnected,
    selectedMention,
    isSingleAgent,
    mentionItems,
    boundAgent,
    boundAgentType,
    selectedKnowledgeIds,
    onSend,
  ]);

  // ==================== 渲染 ====================

  const themeClass = theme === 'light' ? 'input-area--light' : 'input-area--dark';

  return (
    <div className={`input-area ${themeClass}`}>
      {/* 连接错误提示 */}
      {connectionError && (
        <div className="error-banner">
          <div className="ia-error-alert">
            {connectionError}
          </div>
        </div>
      )}

      {/* 已选知识库 Tags（独立行） */}
      {input_isEnableKnowledge && selectedKnowledgeIds.length > 0 && (
        <div className="knowledge-tag-wrapper">
          {selectedKnowledgeIds.map((kid) => (
            <span key={kid} className="knowledge-tag">
              <BookOpen size={14} className="knowledge-tag__icon" />
              <span>{knowledgeGroups.find((g) => g.group_id === kid)?.group_name || kid}</span>
              <button className="knowledge-tag__close" onClick={() => removeKnowledge(kid)}>
                <XCircle size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 文件列表 */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          {uploadedFiles.map((file, index) => (
            <span key={index} className="file-tag">
              <FileText size={14} />
              <span>{file.name}</span>
              <span className="file-size">({formatFileSize(file.size)})</span>
              <button className="file-tag__close" onClick={() => removeFile(index)}>
                <XCircle size={14} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* 输入框容器：文本区域 + 底部图标行 */}
      <div className="input-container" ref={containerRef} style={containerStyle}>
        <textarea
          ref={textareaRef}
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="input-textarea"
          placeholder={inputPlaceholder}
          disabled={!isConnected}
          rows={1}
        />

        {/* 底部图标行 */}
        <div className="input-toolbar" ref={toolbarRef}>
          {/* 1. 智能体选择器 */}
          {showAgentInfo && (
            <div className="toolbar-agent-selector" ref={toolbarAgentRef}>
              {/* 单智能体模式：直接显示，不可选择 */}
              {isSingleAgent ? (
                <button className="toolbar-agent-btn toolbar-agent-btn--single">
                  {mentionItems[0]?.type === 'agent' ? (
                    <User size={12} />
                  ) : (
                    <Users size={12} />
                  )}
                  <span className="toolbar-agent-name">{mentionItems[0]?.name}</span>
                </button>
              ) : (
                <>
                  {/* 已选择的智能体 */}
                  {selectedMention ? (
                    <button
                      className="toolbar-agent-btn toolbar-agent-btn--selected"
                      onClick={toggleMentionPanel}
                    >
                      {selectedMention.type === 'agent' ? (
                        <User size={12} />
                      ) : (
                        <Users size={12} />
                      )}
                      <span className="toolbar-agent-name">{selectedMention.name}</span>
                      <button
                        className="toolbar-agent-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeMention();
                        }}
                        title="移除"
                      >
                        <XCircle size={10} />
                      </button>
                    </button>
                  ) : boundAgent ? (
                    /* 默认绑定的智能体 */
                    <button
                      className="toolbar-agent-btn toolbar-agent-btn--bound"
                      onClick={toggleMentionPanel}
                    >
                      {boundAgentType === 'agent' ? (
                        <User size={12} />
                      ) : (
                        <Users size={12} />
                      )}
                      <span className="toolbar-agent-name">{boundAgent}</span>
                    </button>
                  ) : (
                    /* 无智能体时 */
                    <button
                      className="toolbar-agent-btn toolbar-agent-btn--empty"
                      onClick={toggleMentionPanel}
                    >
                      <Users size={12} />
                      <span className="toolbar-agent-name">选择智能体</span>
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* 正常模式：空间充足时显示所有工具 */}
          {!isCollapsed ? (
            <>
              {/* 2. 文件选择 */}
              {isEnableFile && (
                <Upload
                  beforeUpload={handleFileUpload}
                  showUploadList={false}
                  multiple
                  className="upload-trigger"
                >
                  <button
                    className="toolbar-btn toolbar-btn--attach"
                    disabled={!isConnected || uploading}
                    title="添加附件"
                  >
                    <Plus size={16} />
                  </button>
                </Upload>
              )}

              {/* 3. 知识库选择器 */}
              {input_isEnableKnowledge && (
                <div className="toolbar-knowledge-selector" ref={toolbarKnowledgeRef}>
                  {selectedKnowledgeIds.length > 0 ? (
                    <button
                      className="toolbar-knowledge-btn toolbar-knowledge-btn--selected"
                      onClick={toggleKnowledgePanel}
                    >
                      <BookOpen size={12} />
                      <span className="toolbar-knowledge-count">{selectedKnowledgeIds.length}</span>
                    </button>
                  ) : (
                    <button
                      className="toolbar-knowledge-btn toolbar-knowledge-btn--empty"
                      onClick={toggleKnowledgePanel}
                    >
                      <BookOpen size={12} />
                    </button>
                  )}
                </div>
              )}
            </>
          ) : (
            /* 折叠模式：空间不足时显示更多按钮 */
            <div className="toolbar-more-selector" ref={toolbarMoreRef}>
              <button
                className="toolbar-btn toolbar-btn--more"
                onClick={toggleMorePanel}
                title="更多工具"
              >
                <MoreHorizontal size={16} />
              </button>
              {/* 更多工具面板 */}
              {showMorePanel && (
                <div className="more-panel">
                  {/* 文件上传 */}
                  {isEnableFile && (
                    <Upload
                      beforeUpload={handleFileUpload}
                      showUploadList={false}
                      multiple
                      className="more-panel__item"
                    >
                      <button
                        className="more-panel__btn"
                        disabled={!isConnected || uploading}
                      >
                        <Plus size={14} />
                        <span>添加附件</span>
                      </button>
                    </Upload>
                  )}
                  {/* 知识库 */}
                  {input_isEnableKnowledge && (
                    <button
                      className="more-panel__btn"
                      onClick={() => {
                        setShowMorePanel(false);
                        toggleKnowledgePanel();
                      }}
                    >
                      <BookOpen size={14} />
                      <span>
                        知识库
                        {selectedKnowledgeIds.length > 0
                          ? ` (${selectedKnowledgeIds.length})`
                          : ''}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 发送/终止按钮（右侧） */}
          {!isLoading ? (
            <button
              className="toolbar-btn toolbar-btn--send"
              disabled={!isConnected || (!inputMessage.trim() && uploadedFiles.length === 0) || uploading}
              onClick={handleSend}
              title="发送"
            >
              <ArrowUp size={14} />
            </button>
          ) : (
            <button
              className="toolbar-btn toolbar-btn--stop"
              onClick={onTerminate}
              title="终止对话"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Mention 面板（从工具栏弹出） */}
        {showMentionPanel && (
          <div ref={mentionPanelRef} className="mention-panel mention-panel--toolbar">
            {filteredItems.length === 0 ? (
              <div className="mention-empty">搜索...</div>
            ) : (
              <div className="mention-list">
                {filteredItems.map((item, index) => (
                  <div
                    key={`${item.type}-${item.name}`}
                    className={`mention-item ${index === selectedMentionIndex ? 'mention-item--active' : ''}`}
                    onClick={() => selectMention(item, mentionStartIndex === -1)}
                    onMouseEnter={() => setSelectedMentionIndex(index)}
                  >
                    {item.type === 'agent' ? (
                      <User size={18} className="mention-item__icon" />
                    ) : (
                      <Users size={18} className="mention-item__icon" />
                    )}
                    <div className="mention-item__info">
                      <div className="mention-item__name">{item.name}</div>
                      {item.description && (
                        <div className="mention-item__desc">{item.description}</div>
                      )}
                    </div>
                    <span
                      className={`mention-type-badge ${
                        item.type === 'agent'
                          ? 'mention-type-badge--agent'
                          : 'mention-type-badge--group'
                      }`}
                    >
                      {item.type === 'agent' ? 'Agent' : 'Group'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 知识库选择面板（从工具栏弹出） */}
        {showKnowledgePanel && (
          <div ref={knowledgePanelRef} className="knowledge-panel knowledge-panel--toolbar">
            <div className="knowledge-panel__header">
              <span>选择知识库</span>
              {selectedKnowledgeIds.length > 0 && (
                <span className="knowledge-panel__count">
                  已选择 {selectedKnowledgeIds.length} 个知识库
                </span>
              )}
            </div>
            {filteredKnowledgeGroups.length === 0 ? (
              <div className="knowledge-panel__empty">暂无可用知识库</div>
            ) : (
              <div className="knowledge-panel__list">
                {filteredKnowledgeGroups.map((group, index) => (
                  <div
                    key={group.group_id}
                    className={`knowledge-panel__item ${
                      index === selectedKnowledgeIndex ? 'knowledge-panel__item--active' : ''
                    }`}
                    onClick={() => selectKnowledge(group)}
                    onMouseEnter={() => setSelectedKnowledgeIndex(index)}
                  >
                    <BookOpen size={18} className="knowledge-panel__item-icon" />
                    <div className="knowledge-panel__item-info">
                      <div className="knowledge-panel__item-name">{group.group_name}</div>
                      {group.description && (
                        <div className="knowledge-panel__item-desc">{group.description}</div>
                      )}
                    </div>
                    <span className="knowledge-panel__item-count">{group.doc_count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 上下文窗口能量条 */}
      {showTokensBar && tokensBarAgentName ? (
        <TokensBar agentName={tokensBarAgentName} tokens={tokensBarValue} />
      ) : showTokensBar ? (
        /* 无智能体配置时的提示 */
        <div className="ia-no-agent-tip">
          <span>暂无配置智能体</span>
        </div>
      ) : null}
    </div>
  );
};
