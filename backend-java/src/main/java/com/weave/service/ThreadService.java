package com.weave.service;

import com.weave.dto.CreateThreadRequest;
import com.weave.dto.ThreadDTO;
import com.weave.model.Group;
import com.weave.model.GroupMember;
import com.weave.model.Thread;
import com.weave.model.ThreadParticipant;
import com.weave.model.User;
import com.weave.repository.ExtractedEntityRepository;
import com.weave.repository.GroupMemberRepository;
import com.weave.repository.GroupRepository;
import com.weave.repository.ThreadParticipantRepository;
import com.weave.repository.ThreadRepository;
import com.weave.repository.UserRepository;
import com.weave.util.SecurityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ThreadService {
    private static final Logger log = LoggerFactory.getLogger(ThreadService.class);
    
    private final ThreadRepository threadRepository;
    private final ThreadParticipantRepository participantRepository;
    private final ExtractedEntityRepository entityRepository;
    private final GroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;

    public ThreadService(ThreadRepository threadRepository, ThreadParticipantRepository participantRepository, ExtractedEntityRepository entityRepository, GroupRepository groupRepository, GroupMemberRepository groupMemberRepository, UserRepository userRepository) {
        this.threadRepository = threadRepository;
        this.participantRepository = participantRepository;
        this.entityRepository = entityRepository;
        this.groupRepository = groupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
    }
    
    public List<ThreadDTO> getThreads(String sort) {
        User currentUser = SecurityUtils.getCurrentUser()
            .orElseThrow(() -> new RuntimeException("User not authenticated"));
        List<Thread> threads = participantRepository.findByUserId(currentUser.getId())
            .stream()
            .map(ThreadParticipant::getThread)
            .collect(Collectors.toList());
        
        switch (sort != null ? sort : "recent") {
            case "attention":
                threads.sort((a, b) -> Integer.compare(
                    (b.getUnresolvedCount() + b.getUnreadCount()),
                    (a.getUnresolvedCount() + a.getUnreadCount())
                ));
                break;
            case "unresolved":
                threads.sort((a, b) -> Integer.compare(b.getUnresolvedCount(), a.getUnresolvedCount()));
                break;
            default:
                threads.sort((a, b) -> b.getLastActivity().compareTo(a.getLastActivity()));
        }
        
        return threads.stream().map(this::toDTO).collect(Collectors.toList());
    }
    
    public ThreadDTO getThread(UUID id) {
        Thread thread = threadRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Thread not found: " + id));
        return toDTO(thread);
    }
    
    public ThreadDTO toDTO(Thread thread) {
        UUID groupId = thread.getGroup().getId();
        
        List<UUID> participants = participantRepository.findByThreadId(thread.getId())
            .stream()
            .map(p -> p.getUser().getId())
            .collect(Collectors.toList());
        
        return new ThreadDTO(
            thread.getId(),
            groupId,
            participants,
            thread.getTitle(),
            thread.getLastActivity(),
            thread.getUnreadCount(),
            thread.getImportanceScore(),
            thread.getMlSummary(),
            thread.getUnresolvedCount(),
            thread.getStatus() != null ? thread.getStatus().name().toLowerCase() : "open"
        );
    }
    
    @Transactional
    public void updateThreadActivity(UUID threadId) {
        Thread thread = threadRepository.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found: " + threadId));
        thread.setLastActivity(Instant.now());
        
        Long unresolvedCount = entityRepository.countUnresolvedByThreadId(threadId);
        thread.setUnresolvedCount(unresolvedCount.intValue());
        
        threadRepository.save(thread);
    }
    
    @Transactional
    public ThreadDTO createThread(CreateThreadRequest request) {
        try {
            User currentUser = SecurityUtils.getCurrentUser()
                .orElse(null);
            
            if (currentUser == null) {
                log.error("createThread: User not found in security context");
                throw new RuntimeException("User not authenticated");
            }
            
            User user = userRepository.findById(currentUser.getId())
                .orElseGet(() -> {
                    log.warn("createThread: User {} not in DB, creating from security context", currentUser.getId());
                    return userRepository.save(currentUser);
                });
            
            Group group = new Group();
            String groupName = request.getTitle() != null && !request.getTitle().isEmpty() 
                ? request.getTitle() 
                : (Boolean.TRUE.equals(request.getIsGroupChat()) ? "Group Chat" : "Direct Message");
            group.setName(groupName);
            group = groupRepository.save(group);
            
            Set<User> participants = new HashSet<>();
            participants.add(user);
            
            if (Boolean.TRUE.equals(request.getIsGroupChat()) && request.getParticipantIds() != null) {
                for (UUID participantId : request.getParticipantIds()) {
                    if (!participantId.equals(user.getId())) {
                        userRepository.findById(participantId).ifPresent(participants::add);
                    }
                }
            }
            
            List<GroupMember> groupMembers = new ArrayList<>();
            for (User participant : participants) {
                GroupMember member = new GroupMember();
                member.setGroup(group);
                member.setUser(participant);
                member.setRole(participant.getId().equals(user.getId()) 
                    ? GroupMember.MemberRole.OWNER 
                    : GroupMember.MemberRole.MEMBER);
                groupMembers.add(member);
            }
            groupMemberRepository.saveAll(groupMembers);
            
            Thread thread = new Thread();
            thread.setGroup(group);
            thread.setTitle(request.getTitle() != null && !request.getTitle().isEmpty() 
                ? request.getTitle() 
                : groupName);
            thread.setLastActivity(Instant.now());
            thread.setUnreadCount(0);
            thread.setImportanceScore(0.0);
            thread.setUnresolvedCount(0);
            thread.setStatus(Thread.ThreadStatus.OPEN);
            thread = threadRepository.save(thread);
            
            List<ThreadParticipant> threadParticipants = new ArrayList<>();
            for (User participant : participants) {
                ThreadParticipant threadParticipant = new ThreadParticipant();
                threadParticipant.setThread(thread);
                threadParticipant.setUser(participant);
                threadParticipants.add(threadParticipant);
            }
            participantRepository.saveAll(threadParticipants);
            
            log.info("Created thread {} for user {}", thread.getId(), user.getId());
            
            UUID groupId = thread.getGroup().getId();
            log.debug("Thread group ID: {}", groupId);
            
            List<ThreadParticipant> loadedParticipants = participantRepository.findByThreadId(thread.getId());
            log.debug("Thread has {} participants", loadedParticipants.size());
            for (ThreadParticipant p : loadedParticipants) {
                p.getUser().getId();
            }
            
            ThreadDTO result = toDTO(thread);
            log.debug("ThreadDTO created successfully for thread {}", thread.getId());
            return result;
            
        } catch (Exception e) {
            log.error("Error creating thread: {}", e.getMessage(), e);
            log.error("Stack trace: ", e);
            throw new RuntimeException("Failed to create thread: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void markThreadRead(UUID threadId) {
        Thread thread = threadRepository.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found: " + threadId));
        thread.setUnreadCount(0);
        threadRepository.save(thread);
    }

    @Transactional
    public ThreadDTO updateThreadStatus(UUID threadId, Thread.ThreadStatus status) {
        Thread thread = threadRepository.findById(threadId)
            .orElseThrow(() -> new RuntimeException("Thread not found: " + threadId));
        thread.setStatus(status);
        thread = threadRepository.save(thread);
        return toDTO(thread);
    }
}

